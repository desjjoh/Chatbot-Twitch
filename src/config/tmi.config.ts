import { NullLogger } from '@/loggers/NULL.logger';
import { env } from './env.config';

import tmi from 'tmi.js';
import type { Options } from 'tmi.js';

export type ISendChat = {
  channel: string;
  message: string;
};

const tmiOptions: Options = {
  options: { debug: false },
  connection: { reconnect: true, secure: true },
  identity: {
    username: env.IRC_NICK,
    password: env.IRC_TOKEN,
  },
  channels: [env.IRC_CHANNEL],
  logger: new NullLogger(),
};

export const client = new tmi.Client(tmiOptions);

export async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message);
}
