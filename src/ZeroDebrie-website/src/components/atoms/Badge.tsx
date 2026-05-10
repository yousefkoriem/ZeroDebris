import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'info' | 'cyan' | 'amber';
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'info' | 'cyan' | 'amber';
  dot?: boolean;
}

export function Badge({ className, variant = 'default', tone, dot, ...props }: BadgeProps) {
  const v = tone || variant;
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",
        {
          'border-transparent bg-cyan-500 text-bg hover:bg-cyan-500/80': v === 'default' || v === 'cyan',
          'border-transparent bg-success-500 text-bg hover:bg-success-500/80': v === 'success',
          'border-transparent bg-amber-500 text-bg hover:bg-amber-500/80': v === 'warning' || v === 'amber',
          'border-transparent bg-danger-500 text-fg hover:bg-danger-500/80': v === 'danger',
          'border-transparent bg-blue-500 text-bg hover:bg-blue-500/80': v === 'info',
          'text-fg border-border': v === 'outline',
        },
        className
      )}
      {...props}
    >
      {dot && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />}
      {props.children}
    </div>
  );
}
