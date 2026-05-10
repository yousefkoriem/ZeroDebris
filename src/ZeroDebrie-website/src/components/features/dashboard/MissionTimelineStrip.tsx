'use client';
import { Card, CardContent } from '@/components/atoms/Card';

export function MissionTimelineStrip() {
  return (
    <Card className="rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Upcoming Schedule</h3>
      </div>
      <div className="relative h-16 bg-elevated/40 p-4 border border-border/40 rounded-xl overflow-hidden">
        <div className="absolute top-0 bottom-0 left-[20%] w-px bg-cyan-500 z-10" />
        <div className="absolute top-1 text-[10px] text-cyan-500 left-[20%] -translate-x-1/2 bg-surface px-1 z-20">NOW</div>
        
        <div className="absolute top-4 left-[25%] h-8 bg-amber-500/80 rounded-md px-2 text-xs font-medium flex items-center text-black whitespace-nowrap overflow-hidden text-ellipsis w-32">
          Payload Downlink
        </div>
        <div className="absolute top-4 left-[60%] h-8 bg-emerald-500/80 rounded-md px-2 text-xs font-medium flex items-center text-black whitespace-nowrap overflow-hidden text-ellipsis w-48">
          AOS Station Beta
        </div>
      </div>
    </Card>
  );
}
