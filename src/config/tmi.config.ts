/**
 * @fileoverview Twitch Messaging Interface (TMI) configuration and chat utility.
 * @module config/tmi
 * @description
 *  Configures and exports a pre-initialized Twitch IRC client using `tmi.js`,
 *  with connection, authentication, and logging options derived from environment
 *  variables. Provides a helper method for sending messages to a configured
 *  Twitch channel.
 *
 * @remarks
 *  - Uses a `NullLogger` to suppress internal TMI logs.
 *  - The client automatically reconnects on disconnects.
 *  - All credentials and channel settings are loaded from validated environment variables.
 *
 * @example
 *  import { client, sendChat } from '@/config/tmi.config';
 *
 *  await client.connect();
 *  await sendChat({ channel: '#k3nata8', message: 'Hello Twitch!' });
 */

import { NullLogger } from '@/loggers/null.logger';
import { env } from './env.config';

import tmi from 'tmi.js';
import type { Options } from 'tmi.js';

/**
 * Shape of the payload for sending a chat message.
 */
export type ISendChat = {
  /** Target Twitch channel (e.g., `#k3nata8`). */
  channel: string;

  /** Message content to send. */
  message: string;
};

/**
 * Configuration object for the Twitch Messaging Interface client.
 * Includes identity, channel, and connection options.
 */
const tmiOptions: Options = {
  options: { debug: false },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: env.IRC_NICK,
    password: env.IRC_TOKEN,
  },
  channels: [env.IRC_CHANNEL],
  logger: new NullLogger(), // Suppresses TMI internal logging
};

/**
 * Preconfigured Twitch IRC client instance.
 * Used throughout the application for connecting and sending messages.
 */
export const client = new tmi.Client(tmiOptions);

/**
 * Sends a message to a specified Twitch channel via the TMI client.
 *
 * @async
 * @function sendChat
 * @param {ISendChat} params - The channel and message payload.
 * @returns {Promise<[string]>} A promise resolving with the message ID(s) sent.
 *
 * @example
 *  await sendChat({ channel: '#k3nata8', message: '!quote add Hello World' });
 */
export async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message);
}
