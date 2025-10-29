import 'dotenv/config';

type ENV = {
  readonly DEBUG: boolean;
  readonly IRC_SERVER: string;
  readonly IRC_PORT: number;
  readonly IRC_NICK: string;
  readonly IRC_TOKEN: string;
  readonly IRC_CHANNEL: string;
  readonly MYSQL_HOST: string;
  readonly MYSQL_USER: string;
  readonly MYSQL_PASSWORD: string;
  readonly MYSQL_DB: string;
  readonly REDIS_HOST: string;
  readonly REDIS_PORT: number;
  readonly REDIS_DB: number;
  readonly REDIS_PASSWORD: string | undefined;
};

export const env: ENV = {
  DEBUG: true,

  IRC_SERVER: process.env.IRC_SERVER ?? 'irc.chat.twitch.tv',
  IRC_PORT: Number(process.env.IRC_PORT) ?? 6667,
  IRC_NICK: process.env.IRC_NICK ?? '',
  IRC_TOKEN: process.env.IRC_TOKEN ?? '',
  IRC_CHANNEL: process.env.IRC_CHANNEL ?? '',

  MYSQL_HOST: process.env.MYSQL_HOST ?? 'mysql',
  MYSQL_USER: process.env.MYSQL_USER ?? 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ?? 'root',
  MYSQL_DB: process.env.MYSQL_DB ?? 'twitchbot',

  REDIS_HOST: process.env.REDIS_HOST ?? 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) ?? 6379,
  REDIS_DB: Number(process.env.REDIS_DB) ?? 0,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? undefined,
};
