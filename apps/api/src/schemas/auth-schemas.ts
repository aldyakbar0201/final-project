import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email('Invalid email format'),
  password: z.string(),
  provider: z.enum(['GOOGLE', 'EMAIL']),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
