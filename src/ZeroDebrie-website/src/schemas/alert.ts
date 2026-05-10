import { z } from 'zod';

export const AlertSchema = z.object({
  id: z.string(),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL', 'info', 'warning', 'critical']),
  message: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  timestamp: z.number().optional(),
  createdAt: z.string().optional(),
  spacecraftId: z.string().optional(),
  collisionProbability: z.number().optional(),
  missDistanceKm: z.number().optional(),
  acknowledgedBy: z.string().nullable().optional(),
  acknowledgedAt: z.string().nullable().optional(),
});

export type Alert = z.infer<typeof AlertSchema>;
