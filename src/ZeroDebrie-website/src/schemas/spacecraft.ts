import { z } from 'zod';

export const SpacecraftSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['NOMINAL', 'WARNING', 'CRITICAL', 'OFFLINE']),
  missionId: z.string(),
  tle: z.tuple([z.string(), z.string()]).optional(),
});

export type Spacecraft = z.infer<typeof SpacecraftSchema>;
