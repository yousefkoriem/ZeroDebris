'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

export function AlertsFeed() {
  const { data, isLoading } = useQuery({ queryKey: ['alerts'], queryFn: api.getAlerts });

  return (
    <Card className="h-full flex flex-col rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
      <div className="flex items-center justify-between mb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon name="Bell" size={20} />
          Recent Alerts
        </CardTitle>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-muted">Loading alerts...</div>
        ) : (
          <div className="flex flex-col">
            {data?.slice(0, 5).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                <div className={cn("mt-1.5 rounded-full w-2 h-2 shrink-0", {
                  'bg-cyan-500': alert.severity === 'INFO',
                  'bg-amber-500': alert.severity === 'WARNING',
                  'bg-red-500': alert.severity === 'CRITICAL',
                })} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-fg">{alert.message}</div>
                </div>
                <div className="text-xs text-muted ml-auto shrink-0 mt-0.5">
                  {formatDate(alert.timestamp || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
