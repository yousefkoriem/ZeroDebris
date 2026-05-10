'use client';
import { useAlerts } from '@/store/alerts';
import { Icon } from '@/components/atoms/Icon';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const alerts = useAlerts((s) => s.alerts);
  const clearAlert = useAlerts((s) => s.clearAlert);

  if (!alerts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {alerts.slice(0, 5).map((alert) => (
        <div key={alert.id} className={cn("pointer-events-auto flex items-start gap-3 w-80 rounded-md border p-4 shadow-lg", {
          'bg-surface border-border text-fg': alert.severity === 'INFO',
          'bg-amber-500/10 border-amber-500/50 text-amber-500': alert.severity === 'WARNING',
          'bg-danger-500/10 border-danger-500/50 text-danger-500': alert.severity === 'CRITICAL',
        })}>
          <Icon name={alert.severity === 'CRITICAL' ? 'TriangleAlert' : alert.severity === 'WARNING' ? 'CircleAlert' : 'Info'} size={20} />
          <div className="flex-1 text-sm font-medium">{alert.message}</div>
          <Button variant="ghost" size="sm" onClick={() => clearAlert(alert.id)} className="h-6 w-6 p-0 shrink-0">
            <Icon name="X" size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}

export const toast = {
  success: (msg: string) => { console.log('Toast success:', msg) },
  error: (msg: string) => { console.error('Toast error:', msg) }
};
