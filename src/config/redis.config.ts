import { RedisOptions } from 'ioredis';
import { env } from './env.config';

export const redisConnection: RedisOptions = {
  host: env.REDIS_HOST ?? 'localhost',
  port: Number(env.REDIS_PORT) ?? 6379,
  password: env.REDIS_PASSWORD ?? undefined,
  db: Number(env.REDIS_DB) ?? 0,
};
