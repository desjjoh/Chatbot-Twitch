import { env } from './env.config';

import tmi from 'tmi.js';
import type { Options } from 'tmi.js';

import { log } from '@/config/logger.config';
import type { Logger, LogLevel } from '@d-fischer/logger';

class CustomLogger implements Logger {
  minLevel = Number.POSITIVE_INFINITY;
  name = 'null';

  log(_level: LogLevel, _message: string): void {}
  crit(_message: string): void {}
  error(_message: string): void {}
  warn(_message: string): void {}
  info(_message: string): void {}
  debug(_message: string): void {}
  trace(_message: string): void {}
}

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
  logger: new CustomLogger(),
};

export const client = new tmi.Client(tmiOptions);

export async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message);
}
