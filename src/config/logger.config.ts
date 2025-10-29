import pino from 'pino';

export const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      singleLine: true,
      ignore: 'pid,hostname',
      messageFormat: '{msg}',
    },
  },
});
