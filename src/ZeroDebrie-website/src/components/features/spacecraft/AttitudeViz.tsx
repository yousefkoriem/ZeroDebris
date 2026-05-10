'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTelemetryStream } from '@/hooks/useTelemetryStream';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AttitudeViz({ spacecraftId }: { spacecraftId: string }) {
  const history = useTelemetryStream(spacecraftId);
  const latest = history[history.length - 1];
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    camera.position.z = 5;

    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (cubeRef.current && latest?.attitude) {
      cubeRef.current.rotation.x = latest.attitude.pitch;
      cubeRef.current.rotation.y = latest.attitude.yaw;
      cubeRef.current.rotation.z = latest.attitude.roll;
    }
  }, [latest]);

  if (reducedMotion) {
    return (
      <Card>
        <CardHeader><CardTitle>Attitude</CardTitle></CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted text-sm">
          3D visualizations disabled (Reduced Motion)
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Attitude</CardTitle></CardHeader>
      <CardContent className="h-48 p-0 overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
}
