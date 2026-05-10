import { TelemetryCharts } from '@/components/features/spacecraft/TelemetryCharts';
import { FuelGauge } from '@/components/features/spacecraft/FuelGauge';
import { AttitudeViz } from '@/components/features/spacecraft/AttitudeViz';
import { ScheduleList } from '@/components/features/spacecraft/ScheduleList';

export default function SpacecraftDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Spacecraft SC-{params.id}</h1>
        <p className="text-muted">Live telemetry and operational status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FuelGauge spacecraftId={params.id} />
        <AttitudeViz spacecraftId={params.id} />
        <ScheduleList />
      </div>

      <TelemetryCharts spacecraftId={params.id} />
    </div>
  );
}
