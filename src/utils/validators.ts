import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['farmer', 'buyer', 'provider']).default('farmer'),
  location: z.string().optional(),
  crops: z.array(z.string()).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  chatId: z.string().optional(),
});