'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { queryClient } from '@/lib/queryClient';
import { useEffect, useState } from 'react';
import { TooltipProvider } from '@/components/atoms/Tooltip';
import { ToastContainer } from '@/components/molecules/Toast';

import { subscribeToLiveTelemetry } from '@/store/telemetry';

export function Providers({ children }: { children: React.ReactNode }) {
  const isLive = process.env.NEXT_PUBLIC_FEATURE_LIVE_TELEMETRY === 'true';
  const [mswReady, setMswReady] = useState(isLive);

  useEffect(() => {
    if (isLive) {
      const sub = subscribeToLiveTelemetry();
      return () => {
        sub.unsubscribe();
      };
    } else {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass', quiet: true }).then(() => setMswReady(true));
      });
    }
  }, [isLive]);

  if (!mswReady) {
    return <div className="h-screen w-screen flex items-center justify-center bg-bg text-cyan-500">Initializing Core Systems...</div>;
  }

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <ToastContainer />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
