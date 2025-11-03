/**
 * @fileoverview Environment variable schema validation and configuration loader.
 * @module config/env
 * @description
 *  Validates and transforms environment variables using `zod` before the application
 *  starts. Prevents runtime errors by enforcing correct types, defaults, and required
 *  values for all critical configuration parameters.
 *
 * @remarks
 *  - Uses a strict Zod schema for validation.
 *  - Automatically logs and exits if validation fails.
 *  - Transforms numeric and boolean environment values safely.
 *  - Ensures consistent configuration across Redis, MySQL, and IRC services.
 *
 * @example
 *  import { env } from '@/config/env.config';
 *  console.log(`Connecting to Redis at ${env.REDIS_HOST}:${env.REDIS_PORT}`);
 */

import 'dotenv/config';
import { z } from 'zod';
import { log } from '@/config/pino.config';

/**
 * Zod validation schema defining all expected environment variables.
 * Provides transformations and default values for each configuration key.
 */
const envSchema = z.object({
  /** Enables debug mode when `true` or `'1'`. */
  DEBUG: z
    .string()
    .transform((v) => v === 'true' || v === '1')
    .default(false),

  /** IRC server hostname (e.g., `irc.chat.twitch.tv`). */
  IRC_SERVER: z.string().min(1, 'IRC_SERVER is required'),

  /** IRC connection port (default: 6667). */
  IRC_PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, 'IRC_PORT must be a valid number')
    .default(6667),

  /** IRC bot nickname. */
  IRC_NICK: z.string().min(1, 'IRC_NICK is required'),

  /** OAuth token for IRC authentication (e.g., `oauth:...`). */
  IRC_TOKEN: z.string().min(1, 'IRC_TOKEN is required'),

  /** Default IRC channel to join (e.g., `#k3nata8`). */
  IRC_CHANNEL: z.string().min(1, 'IRC_CHANNEL is required'),

  /** MySQL host address (default: `mysql`). */
  MYSQL_HOST: z.string().min(1, 'MYSQL_HOST is required').default('mysql'),

  /** MySQL user (default: `root`). */
  MYSQL_USER: z.string().min(1, 'MYSQL_USER is required').default('root'),

  /** MySQL password (default: `root`). */
  MYSQL_PASSWORD: z.string().min(1, 'MYSQL_PASSWORD is required').default('root'),

  /** MySQL database name (default: `twitchbot`). */
  MYSQL_DB: z.string().min(1, 'MYSQL_DB is required').default('twitchbot'),

  /** Redis host address (default: `localhost`). */
  REDIS_HOST: z.string().min(1, 'REDIS_HOST is required').default('localhost'),

  /** Redis port number (default: 6379). */
  REDIS_PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, 'REDIS_PORT must be a valid number')
    .default(6379),

  /** Redis logical database index (default: 0). */
  REDIS_DB: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v >= 0, 'REDIS_DB must be a valid number')
    .default(0),

  /** Redis authentication password (optional). */
  REDIS_PASSWORD: z.string().optional(),
});

/**
 * Parse and validate the active environment variables.
 * Logs structured errors and exits immediately on validation failure.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const context = 'Environment';
  const tree = z.treeifyError(parsed.error);

  log.error({ context, errors: tree }, '[env] validation failed');
  process.exit(0);
}

/**
 * Typed, validated, and transformed environment configuration.
 * Safe to import and use throughout the application.
 *
 * @example
 *  console.log(env.MYSQL_HOST);
 */
export const env = parsed.data;
