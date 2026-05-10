'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Viewer,
  Entity,
  PointGraphics,
  LabelGraphics,
  PolylineGraphics,
} from 'resium';
import * as Cesium from 'cesium';
import { Cartesian3, Color, Ion, LabelStyle } from 'cesium';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useTelemetry } from '@/store/telemetry';
import type { CesiumComponentRef } from 'resium';
import * as satellite from 'satellite.js';

import 'cesium/Build/Cesium/Widgets/widgets.css';

if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/cesium';
}

if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
  Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
}

// ─── TLE Data ────────────────────────────────────────────────────────────────
const SAMPLE_TLE: Record<string, [string, string]> = {
  'eo-1': [
    '1 25544U 98067A   24001.50000000  .00015000  00000+0  27000-3 0  9999',
    '2 25544  51.6400  90.0000 0001000  10.0000 350.0000 15.49500000000010',
  ],
};

// ─── Ground Stations ─────────────────────────────────────────────────────────
const GROUND_STATIONS = [
  { id: 'cairo-1', name: 'CAIRO-1', lat: 30.04, lon: 31.24 },
  { id: 'aswan',   name: 'ASWAN',   lat: 24.09, lon: 32.90 },
  { id: 'alex',    name: 'ALEX-GS', lat: 31.20, lon: 29.95 },
];

// ─── SGP4 Ground Track ───────────────────────────────────────────────────────
interface TrackPoint {
  latitude: number;
  longitude: number;
  altitudeKm: number;
}

function groundTrack(
  tleLine1: string,
  tleLine2: string,
  startMs: number,
  durationMinutes: number,
  steps: number,
): TrackPoint[] {
  try {
    const satrec = satellite.twoline2satrec(tleLine1, tleLine2);
    const points: TrackPoint[] = [];
    const stepMs = (durationMinutes * 60 * 1000) / steps;

    for (let i = 0; i <= steps; i++) {
      const t = new Date(startMs + i * stepMs);
      const pv = satellite.propagate(satrec, t);
      if (!pv || typeof pv.position === 'boolean' || !pv.position) continue;

      const gmst = satellite.gstime(t);
      const geo = satellite.eciToGeodetic(pv.position as satellite.EciVec3<number>, gmst);

      points.push({
        latitude: satellite.degreesLat(geo.latitude),
        longitude: satellite.degreesLong(geo.longitude),
        altitudeKm: geo.height,
      });
    }
    return points;
  } catch {
    return [];
  }
}

// ─── Layer Toggle ─────────────────────────────────────────────────────────────
interface LayerState {
  groundTrack: boolean;
  groundStations: boolean;
  debris: boolean;
}

function LayerToggle({
  layers,
  onChange,
}: {
  layers: LayerState;
  onChange: (key: keyof LayerState) => void;
}) {
  const entries: { key: keyof LayerState; label: string; color: string }[] = [
    { key: 'groundTrack',    label: 'Ground Track',    color: '#00D4FF' },
    { key: 'groundStations', label: 'Ground Stations', color: '#38DC82' },
    { key: 'debris',         label: 'Debris',          color: '#FF4060' },
  ];

  return (
    <div className="glass rounded-xl border border-border/60 p-4 flex flex-col gap-3 min-w-[180px] shadow-xl backdrop-blur-md bg-surface/80">
      <span className="text-xs uppercase tracking-widest text-muted mb-1 font-semibold">
        MAP LAYERS
      </span>
      {entries.map(({ key, label, color }) => (
        <label
          key={key}
          className="flex items-center gap-2 text-sm cursor-pointer text-fg hover:text-white transition"
        >
          <input
            type="checkbox"
            checked={layers[key]}
            onChange={() => onChange(key)}
            className="hidden"
          />
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: layers[key] ? color : '#374151' }}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

// ─── Default spacecraft positions (before live telemetry arrives) ─────────────
const DEFAULT_POSITIONS: Record<string, [number, number, number]> = {
  'eo-1': [31.24, 30.04, 600_000],
  '2':    [35.0,  7.0,   600_000],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function OrbitGlobe() {
  const { data: spacecrafts } = useQuery({
    queryKey: ['spacecrafts'],
    queryFn: api.getSpacecrafts,
  });

  const [mounted, setMounted] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    groundTrack:    true,
    groundStations: true,
    debris:         true,
  });

  const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);

  // Telemetry — stable selector (no ?? [] to avoid infinite loops)
  const eo1History = useTelemetry((s) => s.history['eo-1']);
  const latestEo1  = eo1History?.[eo1History.length - 1];

  // ── Ground track via SGP4 (recomputed when layer toggled) ───────────────────
  const trackPositions = useMemo<number[]>(() => {
    if (!layers.groundTrack) return [];
    const tle = SAMPLE_TLE['eo-1'];
    if (!tle) return [];
    const pts = groundTrack(tle[0], tle[1], Date.now(), 90, 60);
    return pts.flatMap((p) => [p.longitude, p.latitude, 15_000]);
  }, [layers.groundTrack]);

  // ── Spacecraft positions — stable refs, computed once per spacecraft list ───
  const spacecraftPositions = useMemo<Record<string, Cartesian3>>(() => {
    if (!spacecrafts) return {};
    return Object.fromEntries(
      spacecrafts.map((sc) => {
        const def = DEFAULT_POSITIONS[sc.id] ?? [30.0, 27.0, 600_000];
        return [sc.id, Cartesian3.fromDegrees(def[0], def[1], def[2])];
      }),
    );
  }, [spacecrafts]);

  // ── Mount guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Camera: snap to Egypt on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const v = viewerRef.current?.cesiumElement;
    if (!v || v.isDestroyed()) return;
    v.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        30.0,      // longitude — centre of Egypt
        27.0,      // latitude  — centre of Egypt
        1_800_000, // shows Egypt + Sinai + Nile Delta clearly
      ),
      duration: 0,
    });
  }, [mounted]);

  const toggleLayer = (key: keyof LayerState) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Loading placeholder ─────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="h-full w-full bg-bg flex items-center justify-center text-muted">
        Initializing 3D Engine...
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* FIX 4: LayerToggle OUTSIDE the Viewer — Cesium overrides absolute
          children placed inside its canvas wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 50,
          pointerEvents: 'auto',
        }}
      >
        <LayerToggle layers={layers} onChange={toggleLayer} />
      </div>

      <Viewer
        ref={viewerRef}
        full={false}
        style={{ width: '100%', height: '100%' }}
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        fullscreenButton={false}
      >
        {/* ── FIX 1: Satellite dots at 600 km altitude ────────────────────── */}
        {spacecrafts?.map((sc) => {
          // If live telemetry has arrived for eo-1, use it — otherwise default
          let pos = spacecraftPositions[sc.id];
          if (
            sc.id === 'eo-1' &&
            latestEo1 &&
            latestEo1.latitude !== undefined &&
            latestEo1.longitude !== undefined
          ) {
            pos = Cartesian3.fromDegrees(
              latestEo1.longitude,
              latestEo1.latitude,
              (latestEo1.altitude ?? 600) * 1000,
            );
          }
          if (!pos) return null;

          return (
            <Entity key={sc.id} position={pos} name={sc.name}>
              <PointGraphics
                pixelSize={12}
                color={Color.CYAN}
                outlineColor={Color.WHITE}
                outlineWidth={2}
              />
              <LabelGraphics
                text={sc.name}
                font="12px monospace"
                fillColor={Color.WHITE}
                style={LabelStyle.FILL_AND_OUTLINE}
                outlineWidth={2}
                pixelOffset={new Cartesian3(0, -22, 0)}
              />
            </Entity>
          );
        })}

        {/* ── FIX 2: Ground track polyline (SGP4) ─────────────────────────── */}
        {layers.groundTrack && trackPositions.length > 6 && (
          <Entity name="eo-1-ground-track">
            <PolylineGraphics
              positions={Cartesian3.fromDegreesArrayHeights(trackPositions)}
              width={2}
              material={Color.fromCssColorString('rgba(0,212,255,0.7)')}
              clampToGround={false}
            />
          </Entity>
        )}

        {/* ── FIX 5: Ground station markers ───────────────────────────────── */}
        {layers.groundStations &&
          GROUND_STATIONS.map((g) => (
            <Entity
              key={g.id}
              position={Cartesian3.fromDegrees(g.lon, g.lat, 0)}
              name={g.name}
            >
              <PointGraphics
                pixelSize={10}
                color={Color.fromCssColorString('#38DC82')}
                outlineColor={Color.WHITE}
                outlineWidth={1}
              />
              <LabelGraphics
                text={g.name}
                font="10px monospace"
                fillColor={Color.WHITE}
                style={LabelStyle.FILL_AND_OUTLINE}
                outlineWidth={2}
                pixelOffset={new Cartesian3(0, -16, 0)}
              />
            </Entity>
          ))}

        {/* ── FIX 6: Debris marker ─────────────────────────────────────────── */}
        {layers.debris && (
          <Entity
            name="COSMOS-1408 frag-A"
            position={Cartesian3.fromDegrees(60.0, 45.0, 480_000)}
          >
            <PointGraphics
              pixelSize={8}
              color={Color.fromCssColorString('#FF4060')}
              outlineColor={Color.WHITE}
              outlineWidth={1}
            />
            <LabelGraphics
              text="COSMOS-1408"
              font="9px monospace"
              pixelOffset={new Cartesian3(0, -14, 0)}
              fillColor={Color.fromCssColorString('#FF4060')}
            />
          </Entity>
        )}
      </Viewer>
    </div>
  );
}
