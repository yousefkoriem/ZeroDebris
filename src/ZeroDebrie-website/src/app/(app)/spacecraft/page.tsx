import { FleetTable } from '@/components/features/dashboard/FleetTable';

export default function SpacecraftPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fleet Status</h1>
        <p className="text-muted">Detailed view of all operational spacecraft.</p>
      </div>
      <FleetTable />
    </div>
  );
}
