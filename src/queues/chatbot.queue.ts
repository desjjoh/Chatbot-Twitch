import { Queue, Worker, Job } from 'bullmq';

import { sendChat } from '@/config/tmi.config.js';
import { redisConnection } from '@/config/redis.config.js';
import { PayloadType, defaultJobOptions, queueName } from '@/config/chatbot.config.js';
import { log } from '@/config/pino.config';

const context = 'Chatbot';

const processJob = async ({ id, data }: Job<PayloadType>): Promise<void> => {
  log.info({ context, jobId: id, payload: data }, `[chatbot] job :${id} started`);
  const started = performance.now();

  try {
    await sendChat(data);

    const duration = (performance.now() - started).toFixed(2);
    log.info({ context, jobId: id, duration }, `[chatbot] job :${id} completed`);
  } catch (err: unknown) {
    const duration = (performance.now() - started).toFixed(2);

    if (err instanceof Error) {
      log.error({ context, jobId: id, duration, reason: err.message }, '[chatbot] job failed');
      throw err;
    } else {
      log.error({ context, jobId: id, duration, reason: String(err) }, '[chatbot] job failed');
      throw new Error(String(err));
    }
  }
};

const worker = new Worker<PayloadType>(queueName, processJob, {
  connection: redisConnection,
  limiter: {
    max: 1,
    duration: 3000,
  },
});

worker.on('ready', () => log.info({ context }, '[chatbot] worker ready'));
worker.on('error', (err) => log.error({ context, reason: err.message }, '[chatbot] worker error'));
worker.on('closed', () => log.warn({ context }, '[chatbot] worker closed'));
worker.on('stalled', (jobId) => log.warn({ context, jobId }, '[chatbot] job stalled'));

const queue = new Queue<PayloadType>(queueName, {
  connection: redisConnection,
  defaultJobOptions,
});

log.info({ context, queueName }, '[chatbot] initialized');

export default async function enqueue(payload: PayloadType): Promise<void> {
  try {
    const job = await queue.add(queueName, payload);
    log.info({ context, jobId: job.id, payload }, '[queue] job enqueued');
  } catch (err: unknown) {
    log.error(
      { context, reason: err instanceof Error ? err.message : String(err) },
      '[queue] failed to enqueue job',
    );
    throw err;
  }
}
