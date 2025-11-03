/**
 * @fileoverview Chatbot job queue and worker using BullMQ.
 * @module chatbot/queue
 * @description
 *  Manages asynchronous chat message processing for the Twitch chatbot.
 *  Provides lifecycle-safe initialization, contextual logging, and
 *  graceful shutdown of BullMQ queue and worker instances.
 */

import { Queue, Worker, Job } from 'bullmq';
import { sendChat } from '@/config/tmi.config.js';
import { redisConnection } from '@/config/redis.config.js';
import { PayloadType, defaultJobOptions, queueName } from '@/config/chatbot.config.js';
import { log } from '@/config/pino.config';

/**
 * Context identifier for all queue and worker logs.
 */
const context = 'Chatbot';

/**
 * Handles all lifecycle operations for the chatbot message queue.
 * Exposes methods for enqueueing jobs and shutting down cleanly.
 */
export class ChatbotQueueManager {
  private static queue: Queue<PayloadType>;
  private static worker: Worker<PayloadType>;

  /**
   * Initializes the BullMQ worker and queue instances.
   * @returns {Promise<void>} Resolves when initialization completes successfully.
   */
  public static async init(): Promise<void> {
    log.info({ context, queueName }, '[chatbot] initializing...');

    // Worker — processes queued chat jobs sequentially (1 job / 3s)
    this.worker = new Worker<PayloadType>(queueName, this.processJob, {
      connection: redisConnection,
      limiter: {
        max: 1,
        duration: 3000,
      },
    });

    // Worker lifecycle event logging
    this.worker.on('ready', () => log.info({ context }, '[chatbot] worker ready'));
    this.worker.on('error', (err) =>
      log.error({ context, reason: err.message }, '[chatbot] worker error'),
    );
    this.worker.on('closed', () => log.warn({ context }, '[chatbot] worker closed'));
    this.worker.on('stalled', (jobId) => log.warn({ context, jobId }, '[chatbot] job stalled'));

    // Queue — for adding new chat jobs
    this.queue = new Queue<PayloadType>(queueName, {
      connection: redisConnection,
      defaultJobOptions,
    });

    log.info({ context, queueName }, '[chatbot] initialized successfully');
  }

  /**
   * Adds a new chat message job to the BullMQ queue.
   *
   * @param payload - The payload containing chat message data.
   * @returns {Promise<void>} Resolves when the job is successfully enqueued.
   */
  public static async enqueue(payload: PayloadType): Promise<void> {
    if (!this.queue) {
      log.error({ context }, '[queue] cannot enqueue job — queue not initialized');
      throw new Error('Chatbot queue not initialized');
    }

    try {
      const job = await this.queue.add(queueName, payload);
      log.info({ context, jobId: job.id, payload }, '[queue] job enqueued');
    } catch (err: unknown) {
      log.error(
        { context, reason: err instanceof Error ? err.message : String(err) },
        '[queue] failed to enqueue job',
      );
      throw err;
    }
  }

  /**
   * Processes a single chat message job from the queue.
   * @param job - The BullMQ job instance containing payload data.
   */
  private static async processJob({ id, data }: Job<PayloadType>): Promise<void> {
    log.info({ context, jobId: id, payload: data }, `[chatbot] job :${id} started`);
    const started = performance.now();

    try {
      await sendChat(data);
      const duration = (performance.now() - started).toFixed(2);
      log.info({ context, jobId: id, duration }, `[chatbot] job :${id} completed`);
    } catch (err: unknown) {
      const duration = (performance.now() - started).toFixed(2);
      const reason = err instanceof Error ? err.message : String(err);

      log.error({ context, jobId: id, duration, reason }, '[chatbot] job failed');
      throw err instanceof Error ? err : new Error(reason);
    }
  }

  /**
   * Gracefully closes the BullMQ worker and queue connections.
   * Called automatically during application shutdown.
   *
   * @returns {Promise<void>} Resolves when all resources are closed.
   */
  public static async shutdown(): Promise<void> {
    log.info({ context }, '[chatbot] shutting down...');

    try {
      if (this.worker) {
        await this.worker.close();
        log.info({ context }, '[chatbot] worker closed gracefully');
      }

      if (this.queue) {
        await this.queue.close();
        log.info({ context }, '[chatbot] queue closed gracefully');
      }
    } catch (err: unknown) {
      log.error(
        { context, reason: err instanceof Error ? err.message : String(err) },
        '[chatbot] error during shutdown',
      );
    }
  }
}
