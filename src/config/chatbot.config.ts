/**
 * @fileoverview Chatbot job configuration and payload definitions.
 * @module config/chatbot
 * @description
 *  Defines the message payload structure and BullMQ queue configuration
 *  used by the chatbot worker system. This module standardizes how chat
 *  messages and related user metadata are queued and processed.
 *
 * @remarks
 *  - `PayloadType` defines the schema for queued chatbot jobs.
 *  - `queueName` provides a consistent identifier for the BullMQ queue.
 *  - `defaultJobOptions` configures queue behavior and retry logic.
 *
 * @example
 *  import { Queue } from 'bullmq';
 *  import { redisConnection } from '@/config/redis.config';
 *  import { queueName, defaultJobOptions, PayloadType } from '@/config/chatbot.config';
 *
 *  const queue = new Queue<PayloadType>(queueName, {
 *    connection: redisConnection,
 *    defaultJobOptions,
 *  });
 *
 *  await queue.add(queueName, {
 *    channel: '#k3nata8',
 *    message: '!quote add Hello World',
 *    userstate,
 *  });
 */

import { JobsOptions } from 'bullmq';
import { ChatUserstate } from 'tmi.js';

/**
 * Payload type for chatbot message jobs.
 * Represents the structure of data queued for processing by the chatbot worker.
 */
export type PayloadType = {
  /** Target Twitch channel where the message originated. */
  channel: string;

  /** Full chat message text. */
  message: string;

  /** Twitch IRC user metadata associated with the message. */
  userstate: ChatUserstate;
};

/**
 * Unique queue name used by BullMQ for chatbot message processing.
 * Ensures consistent naming between producer and worker.
 */
export const queueName = 'chatbot';

/**
 * Default BullMQ job options controlling job lifecycle and retries.
 */
export const defaultJobOptions: JobsOptions = {
  /** Remove completed jobs automatically to conserve memory. */
  removeOnComplete: true,

  /** Retain failed jobs for inspection and debugging. */
  removeOnFail: false,

  /** Maximum number of retry attempts for failed jobs. */
  attempts: 3,
};
