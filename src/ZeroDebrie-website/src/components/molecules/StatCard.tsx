import { Card, CardContent } from '@/components/atoms/Card';
import { Icon } from '@/components/atoms/Icon';
import { cn } from '@/lib/utils';
import { icons } from 'lucide-react';

interface StatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  icon?: keyof typeof icons;
  unit?: string;
  trend?: { value: number; label: string };
  status?: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  tone?: 'cyan' | 'success' | 'amber' | 'danger';
}

export function StatCard({ title, label, value, icon, unit, trend, status, tone }: StatCardProps) {
  const displayTitle = title || label;
  return (
    <Card className="min-h-[120px] border-l-2 border-l-cyan-500 rounded-xl border border-border/60 bg-surface p-5 hover:border-cyan-500/40 hover:bg-elevated/60 transition">
      <CardContent className="p-4 flex flex-col gap-2">
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {icon && <Icon name={icon} size={16} className="text-muted" />}
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">{displayTitle}</span>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-start">
            <span className="text-4xl font-bold font-mono text-cyan-400">{value}</span>
            {unit && <span className="text-xs text-muted ml-1 mt-2 align-top">{unit}</span>}
          </div>
          {status && (
            <span className={cn("w-2 h-2 rounded-full mb-2", {
              'bg-success-500': status === 'NOMINAL',
              'bg-amber-500': status === 'WARNING',
              'bg-danger-500': status === 'CRITICAL',
            })} />
          )}
          {trend && (
            <div className={cn("text-xs flex items-center gap-1 mb-1 font-medium", 
              trend.value > 0 ? "text-success-500" : trend.value < 0 ? "text-danger-500" : "text-muted"
            )}>
              {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
