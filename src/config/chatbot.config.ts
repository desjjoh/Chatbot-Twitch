import { JobsOptions } from 'bullmq';
import { ChatUserstate } from 'tmi.js';

export type PayloadType = {
  channel: string;
  message: string;
  userstate: ChatUserstate;
};

export const queueName = 'chatbot';
export const defaultJobOptions: JobsOptions = {
  removeOnComplete: true,
  removeOnFail: false,
  attempts: 3,
};
