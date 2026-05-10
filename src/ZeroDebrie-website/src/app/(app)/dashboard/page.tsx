import { KPIGrid } from '@/components/features/dashboard/KPIGrid';
import { FleetTable } from '@/components/features/dashboard/FleetTable';
import { AlertsFeed } from '@/components/features/dashboard/AlertsFeed';
import { MissionTimelineStrip } from '@/components/features/dashboard/MissionTimelineStrip';

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mission Dashboard</h1>
        <p className="text-muted">Overview of active space assets and network status.</p>
      </div>

      <KPIGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FleetTable />
          <MissionTimelineStrip />
        </div>
        <div className="h-96 lg:h-auto">
          <AlertsFeed />
        </div>
      </div>
    </div>
  );
}
