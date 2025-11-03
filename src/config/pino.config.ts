/**
 * @fileoverview Global Pino logger configuration.
 * @module config/pino
 * @description
 *  Exports a preconfigured instance of the Pino logger, providing structured,
 *  colorized, single-line logs with timestamps. Used throughout the application
 *  for consistent and high-performance logging across all modules.
 *
 * @remarks
 *  - Defaults to `info` log level unless `LOG_LEVEL` is defined.
 *  - Uses `pino-pretty` for developer-friendly console output.
 *  - Strips out process metadata (`pid`, `hostname`) for cleaner logs.
 *
 * @example
 *  import { log } from '@/config/pino.config';
 *
 *  log.info({ context: 'Server' }, 'Application started');
 *  log.error({ context: 'Database', reason: err.message }, 'Failed to connect');
 */

import pino, { Logger } from 'pino';

/**
 * Preconfigured global logger instance.
 *
 * @constant
 * @type {Logger}
 * @property {string} level - Log level threshold (default: `'info'`).
 * @property {object} transport - Pretty-print configuration for console output.
 *
 * @example
 *  log.warn({ context: 'HealthCheck' }, 'Redis latency above threshold');
 */
export const log: Logger = pino({
  /** Minimum log level to output (can be overridden via `LOG_LEVEL` env var). */
  level: process.env.LOG_LEVEL || 'info',

  /** Pretty-print configuration for human-readable console logs. */
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Adds ANSI colors to output
      translateTime: 'HH:MM:ss.l', // Human-readable timestamp
      singleLine: true, // Keep logs concise on one line
      ignore: 'pid,hostname', // Exclude noisy system metadata
      messageFormat: '{msg}', // Simplify message field format
    },
  },
});
