import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useTelemetry } from '@/store/telemetry';

const EMPTY_ARRAY: any[] = [];

export function useTelemetryStream(spacecraftId: string) {
  const history = useTelemetry((s) => s.history[spacecraftId]);

  useQuery({
    queryKey: ['telemetry-poll', spacecraftId],
    queryFn: () => api.getTelemetry(spacecraftId).then((f) => {
      useTelemetry.getState().push(f);
      return f;
    }),
    refetchInterval: 5_000,
  });

  return history ?? EMPTY_ARRAY;
}
