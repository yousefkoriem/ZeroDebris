import { z } from 'zod';

export const MissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  objective: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'FAILED']),
});

export type Mission = z.infer<typeof MissionSchema>;
