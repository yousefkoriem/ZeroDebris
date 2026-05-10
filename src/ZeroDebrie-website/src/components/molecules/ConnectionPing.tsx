'use client';
import { cn } from '@/lib/utils';

export function ConnectionPing({ status, label }: { status: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'open' | 'error', label?: string }) {
  const isActive = status === 'CONNECTED' || status === 'open';
  const isPending = status === 'CONNECTING';
  const isError = status === 'DISCONNECTED' || status === 'error';
  const displayLabel = label || status;

  return (
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
      <div className="relative flex h-2.5 w-2.5">
        {isActive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-500 opacity-75" />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", {
          'bg-success-500': isActive,
          'bg-amber-500 animate-pulse': isPending,
          'bg-danger-500': isError,
        })} />
      </div>
      <span className={cn({
        'text-success-500': isActive,
        'text-amber-500': isPending,
        'text-danger-500': isError,
      })}>
        {displayLabel}
      </span>
    </div>
  );
}
