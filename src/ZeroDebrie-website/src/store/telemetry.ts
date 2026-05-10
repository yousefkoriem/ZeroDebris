import { create } from 'zustand';
import type { Telemetry } from '@/schemas/telemetry';
import { TelemetrySchema } from '@/schemas/telemetry';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/ui';

interface TelemetryState {
  history: Record<string, Telemetry[]>;
  lastTickAt: number | null;
  push: (data: Telemetry) => void;
}

export const useTelemetry = create<TelemetryState>((set) => ({
  history: {},
  lastTickAt: null,
  push: (data) => set((state) => {
    const list = state.history[data.spacecraftId] ?? [];
    const newList = [...list, data].slice(-100);
    return {
      lastTickAt: Date.now(),
      history: {
        ...state.history,
        [data.spacecraftId]: newList
      }
    };
  })
}));

export function subscribeToLiveTelemetry() {
  return supabase
    .channel('telemetry-live')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'telemetry' },
      (payload) => {
        const raw = payload.new as any;
        const mapped = {
          id: raw.id,
          spacecraftId: raw.spacecraft_id || 'eo-1',
          timestamp: new Date(raw.created_at).getTime(),
          altitude: raw.altitude,
          velocity: raw.velocity,
          fuelLevel: raw.fuel_level,
          latitude: raw.latitude,
          longitude: raw.longitude,
          temperature: raw.temperature
        };

        const result = TelemetrySchema.safeParse(mapped);
        if (result.success) {
          useTelemetry.getState().push(result.data);
        } else {
          console.error('Telemetry validation failed:', result.error);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        useUIStore.getState().setWsStatus('CONNECTED');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        useUIStore.getState().setWsStatus('DISCONNECTED');
      } else {
        useUIStore.getState().setWsStatus('CONNECTING');
      }
    });
}

