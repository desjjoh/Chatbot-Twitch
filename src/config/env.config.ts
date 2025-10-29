import 'dotenv/config';

import { z } from 'zod';
import { log } from '@/config/pino.config';

const envSchema = z.object({
  DEBUG: z
    .string()
    .transform((v) => v === 'true' || v === '1')
    .default(false),

  IRC_SERVER: z.string().min(1, 'IRC_SERVER is required'),
  IRC_PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, 'IRC_PORT must be a valid number')
    .default(6667),

  IRC_NICK: z.string().min(1, 'IRC_NICK is required'),
  IRC_TOKEN: z.string().min(1, 'IRC_TOKEN is required'),
  IRC_CHANNEL: z.string().min(1, 'IRC_CHANNEL is required'),

  MYSQL_HOST: z.string().min(1, 'MYSQL_HOST is required').default('mysql'),
  MYSQL_USER: z.string().min(1, 'MYSQL_USER is required').default('root'),
  MYSQL_PASSWORD: z.string().min(1, 'MYSQL_PASSWORD is required').default('root'),
  MYSQL_DB: z.string().min(1, 'MYSQL_DB is required').default('twitchbot'),

  REDIS_HOST: z.string().min(1, 'REDIS_HOST is required').default('localhost'),
  REDIS_PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, 'REDIS_PORT must be a valid number')
    .default(6379),

  REDIS_DB: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v >= 0, 'REDIS_DB must be a valid number')
    .default(0),

  REDIS_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const context = 'Environment';
  const tree = z.treeifyError(parsed.error);

  log.error({ context, errors: tree }, '[env] validation failed');
  process.exit(0);
}

export const env = parsed.data;
