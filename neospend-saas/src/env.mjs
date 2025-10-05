import { z } from 'zod';

const envSchema = z.object({
    RESEND_API_KEY: z.string().min(1, 're_BMDd3nCm_JW1ySrzE7xAwU4x5w2To6MNu'),
});

export const env = envSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
});