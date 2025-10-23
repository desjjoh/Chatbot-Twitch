import { Queue, Worker, Job } from 'bullmq';
import fs from 'fs/promises';
import moment from 'moment';
import path from 'path';

const MAX_SIZE_MB = 1;
const LOG_DIR = path.join(process.cwd(), 'logs');

import { redisConnection } from '../config/redis.config.js';
import { PayloadType, defaultJobOptions, queueName } from '../config/logger.config.js';
import { fileExists, fileTooBig, formatBlock } from '../helpers/logs.helper.js';

export async function processJob({ data }: Job<PayloadType>): Promise<void> {
  try {
    const now = moment();
    const date = now.format('YYYYMMDD');
    const time = now.format('HH:mm');
    const monthDir = now.format('YYYY-MM');
    const targetDir = path.join(LOG_DIR, monthDir);

    await fs.mkdir(targetDir, { recursive: true });

    let suffix = '';
    let filePath = path.join(targetDir, `${date}${suffix}.log`);

    while ((await fileExists(filePath)) && (await fileTooBig(filePath, MAX_SIZE_MB))) {
      suffix = suffix === '' ? '-1' : `-${Number(suffix.slice(1)) + 1}`;
      filePath = path.join(targetDir, `${date}${suffix}.log`);
    }

    const block = formatBlock({ timestamp: Date.now(), message: data.message });
    const entry = `[${time}] ${data.level.toUpperCase()} [${data.context}]\n${block}\n`;
    const exists = await fileExists(filePath);
    const start = `[${time}] LOG START -- ${now.format('L')}\n${entry}\n`;

    const formatted = exists ? `${entry}` : `${start}`;

    await fs.appendFile(filePath, formatted, 'utf8');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      throw err as Error;
    }
  }
}

new Worker<PayloadType>(queueName, processJob, {
  connection: redisConnection,
  limiter: {
    max: 10,
    duration: 100,
  },
});

const queue = new Queue<PayloadType>(queueName, {
  connection: redisConnection,
  defaultJobOptions,
});

export default async function enqueue(payload: PayloadType): Promise<void> {
  await queue.add(queueName, payload);
}
