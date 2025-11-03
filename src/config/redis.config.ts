/**
 * @fileoverview Redis connection configuration.
 * @module config/redis
 * @description
 *  Exports a typed Redis connection configuration object (`RedisOptions`)
 *  derived from validated environment variables. This configuration is used
 *  across the system for Redis-based features such as BullMQ queues, caching,
 *  and rate limiting.
 *
 * @remarks
 *  - All connection values originate from `env.config`.
 *  - Defaults are provided for local development environments.
 *  - The resulting `redisConnection` object can be passed directly to Redis,
 *    BullMQ, or ioredis client constructors.
 *
 * @example
 *  import { redisConnection } from '@/config/redis.config';
 *  import { Queue } from 'bullmq';
 *
 *  const myQueue = new Queue('tasks', { connection: redisConnection });
 */

import { RedisOptions } from 'ioredis';
import { env } from './env.config';

/**
 * Typed configuration object for establishing a Redis connection.
 * Compatible with both `ioredis` and `bullmq` clients.
 */
export const redisConnection: RedisOptions = {
  /** Redis host address (default: `localhost`). */
  host: env.REDIS_HOST ?? 'localhost',

  /** Redis port (default: `6379`). */
  port: Number(env.REDIS_PORT) ?? 6379,

  /** Redis authentication password (optional). */
  password: env.REDIS_PASSWORD ?? undefined,

  /** Redis logical database index (default: `0`). */
  db: Number(env.REDIS_DB) ?? 0,
};
