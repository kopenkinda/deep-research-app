import { z } from 'zod';
import { status } from './types';

export const updateSchema = z.object({
  id: z.number(),
  status: z.enum(status),
});
