'use client';
import dynamic from 'next/dynamic';

const OrbitGlobe = dynamic(
  () => import('@/components/features/map/OrbitGlobe').then(m => m.OrbitGlobe),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-border">
      <OrbitGlobe />
    </div>
  );
}
