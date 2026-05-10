'use client'
import { StatCard } from '@/components/molecules/StatCard'
import { useTelemetry } from '@/store/telemetry'

export function KPIGrid({ spacecraftId = 'eo-1' }: { spacecraftId?: string } = {}) {
  const history = useTelemetry((s) => s.history[spacecraftId]);
  const latest = history?.[history.length - 1];

  const fuelPct = latest?.fuelLevel ?? 0;
  const altitude = latest?.altitude ?? 0;
  const fuelTone: 'amber' | 'danger' = fuelPct < 20 ? 'danger' : 'amber';
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Orbit Altitude"  value={latest ? altitude.toFixed(1) : "---"} unit="km"   tone="cyan"    />
      <StatCard label="Fuel Reserve"    value={latest ? fuelPct.toFixed(1) : "---"} unit="%" tone={fuelTone} />
      <StatCard label="Collision Risk"  value="1.2e-7"             tone="success" />
      <StatCard label="Reentry ETA"     value="1.8"   unit="yrs"   tone="cyan"    />
    </div>
  )
}
