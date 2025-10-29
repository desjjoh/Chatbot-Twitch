import { Queue, Worker, Job } from 'bullmq';

import { sendChat } from '@/config/tmi.config.js';
import { redisConnection } from '@/config/redis.config.js';
import { PayloadType, defaultJobOptions, queueName } from '@/config/chatbot.config.js';

const processJob = async ({ data }: Job<PayloadType>): Promise<void> => {
  try {
    await sendChat(data);
  } catch (err: unknown) {
    if (err instanceof Error) throw err as Error;
  }
};

new Worker<PayloadType>(queueName, processJob, {
  connection: redisConnection,
  limiter: {
    max: 1,
    duration: 3000,
  },
});

const queue = new Queue<PayloadType>(queueName, {
  connection: redisConnection,
  defaultJobOptions,
});

export default async function enqueue(payload: PayloadType): Promise<void> {
  await queue.add(queueName, payload);
}
