import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['OPERATOR', 'ADMIN', 'VIEWER']),
});

export type User = z.infer<typeof UserSchema>;
