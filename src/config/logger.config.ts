import { JobsOptions } from 'bullmq';

type path = 'system' | 'debug';
type level = 'info' | 'warn' | 'error';

export type PayloadType = {
  timestamp: number;
  level: level;
  message: string;
  context?: string;
};

export const queueName = 'logger';
export const defaultJobOptions: JobsOptions = {
  removeOnComplete: true,
  removeOnFail: false,
  attempts: 1,
};
