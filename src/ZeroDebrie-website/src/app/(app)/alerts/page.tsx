import { AlertInbox } from '@/components/features/alerts/AlertInbox';

export default function AlertsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Alerts</h1>
        <p className="text-muted">Global alerts and anomalies log.</p>
      </div>
      <AlertInbox />
    </div>
  );
}
