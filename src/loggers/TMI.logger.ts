/**
 * @fileoverview Twurple-compatible structured logger bridge for Pino.
 * @module logger/tmi
 * @description
 *  Implements the `@d-fischer/logger` interface expected by Twurple,
 *  routing all log output through the system-wide Pino logger.
 *  This ensures consistent formatting, context fields, and severity levels
 *  across all Twitch messaging and IRC event logs.
 *
 * @remarks
 *  - Supports all Twurple log levels from CRITICAL to TRACE.
 *  - Automatically prefixes messages with `[logger]` for clarity.
 *  - Respects `minLevel` to filter out less severe messages.
 *
 * @example
 *  import { TMILogger } from '@/logger/tmi.logger';
 *  import { ChatClient } from '@twurple/chat';
 *
 *  const client = new ChatClient({ logger: { custom: new TMILogger() } });
 *  await client.connect();
 */

import { log } from '@/config/pino.config';
import { Logger, LogLevel } from '@d-fischer/logger';

/**
 * Twurple-compatible logger adapter that routes output to the Pino logger.
 * Provides contextual, structured, and level-aware logging for TMI events.
 */
export class TMILogger implements Logger {
  /** The minimum log level accepted by this logger. */
  public minLevel = LogLevel.TRACE;

  /** Logical name of the logger instance (used for context tagging). */
  public name = 'TMI';

  /**
   * Determines whether a given log level should be emitted.
   *
   * @param level - The incoming log level from Twurple.
   * @returns {boolean} True if the message should be logged.
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.minLevel;
  }

  /**
   * Formats a log message with a consistent `[logger]` prefix.
   *
   * @param message - The message text to log.
   * @returns {string} Formatted log message.
   */
  private msg(message: string): string {
    return `[logger] ${message}`;
  }

  /**
   * Generic log method implementation required by Twurple's `Logger` interface.
   *
   * @param level - Severity level of the message.
   * @param message - Message text to log.
   */
  public log(level: LogLevel, message: string): void {
    if (!this.shouldLog(level)) return;

    switch (level) {
      case LogLevel.CRITICAL:
        log.fatal({ context: TMILogger.name }, this.msg(message));
        break;
      case LogLevel.ERROR:
        log.error({ context: TMILogger.name }, this.msg(message));
        break;
      case LogLevel.WARNING:
        log.warn({ context: TMILogger.name }, this.msg(message));
        break;
      case LogLevel.INFO:
        log.info({ context: TMILogger.name }, this.msg(message));
        break;
      case LogLevel.DEBUG:
        log.debug?.({ context: TMILogger.name }, this.msg(message));
        break;
      case LogLevel.TRACE:
        log.trace?.({ context: TMILogger.name }, this.msg(message));
        break;
    }
  }

  /** Logs a CRITICAL severity message. */
  public crit(message: string): void {
    if (this.shouldLog(LogLevel.CRITICAL))
      log.fatal({ context: TMILogger.name }, this.msg(message));
  }

  /** Logs an ERROR severity message. */
  public error(message: string): void {
    if (this.shouldLog(LogLevel.ERROR)) log.error({ context: TMILogger.name }, this.msg(message));
  }

  /** Logs a WARNING severity message. */
  public warn(message: string): void {
    if (this.shouldLog(LogLevel.WARNING)) log.warn({ context: TMILogger.name }, this.msg(message));
  }

  /** Logs an INFO severity message. */
  public info(message: string): void {
    if (this.shouldLog(LogLevel.INFO)) log.info({ context: TMILogger.name }, this.msg(message));
  }

  /** Logs a DEBUG severity message (optional for lower verbosity environments). */
  public debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) log.debug?.({ context: TMILogger.name }, this.msg(message));
  }

  /** Logs a TRACE severity message (used for deep diagnostics). */
  public trace(message: string): void {
    if (this.shouldLog(LogLevel.TRACE)) log.trace?.({ context: TMILogger.name }, this.msg(message));
  }
}
