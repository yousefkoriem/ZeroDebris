'use client';
import { useTelemetryStream } from '@/hooks/useTelemetryStream';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

export function FuelGauge({ spacecraftId }: { spacecraftId: string }) {
  const history = useTelemetryStream(spacecraftId);
  const latest = history[history.length - 1];
  const pct = latest ? latest.fuelLevel : 0;
  
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <Card>
      <CardHeader><CardTitle>Propellant</CardTitle></CardHeader>
      <CardContent className="flex justify-center items-center h-48">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140" role="img" aria-label="Fuel Gauge">
            <circle cx="70" cy="70" r={r} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
            <circle 
              cx="70" cy="70" r={r} fill="transparent" 
              stroke="rgb(0, 212, 255)" 
              strokeWidth="12" 
              strokeDasharray={`${dash} ${c - dash}`} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute text-2xl font-bold text-fg">
            {pct.toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
