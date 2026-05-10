import { z } from 'zod';

export const TelemetrySchema = z.object({
  id: z.union([z.string(), z.number()]),
  spacecraftId: z.string(),
  timestamp: z.number(),
  altitude: z.number(),
  velocity: z.number(),
  fuelLevel: z.number(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  batteryLevel: z.number().optional(),
  temperature: z.number().optional(),
  attitude: z.object({
    pitch: z.number(),
    roll: z.number(),
    yaw: z.number()
  }).optional()
});

export type Telemetry = z.infer<typeof TelemetrySchema>;
