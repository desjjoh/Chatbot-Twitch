/**
 * @fileoverview No-op logger implementation for silencing third-party logging output.
 * @module logger/null
 * @description
 *  Provides a stubbed implementation of the `@d-fischer/logger` interface.
 *  Used to disable internal logs from Twurple or other libraries that
 *  require a `Logger` instance but do not support null configuration.
 *
 * @remarks
 *  - Conforms to the `Logger` contract while performing no operations.
 *  - Sets `minLevel` to `Infinity` to ensure no messages are emitted.
 *  - Safe to inject wherever a logger dependency is required.
 *
 * @example
 *  import { NullLogger } from '@/logger/null.logger';
 *  import { ChatClient } from '@twurple/chat';
 *
 *  const client = new ChatClient({ logger: { custom: new NullLogger() } });
 */

import { Logger, LogLevel } from '@d-fischer/logger';

/**
 * A no-op logger implementation that suppresses all log output.
 * Implements the full `Logger` interface but discards all messages.
 */
export class NullLogger implements Logger {
  /** The minimum log level — set to `Infinity` to ignore all messages. */
  public minLevel = Number.POSITIVE_INFINITY;

  /** The logger instance name, for introspection. */
  public name = 'null';

  /**
   * Core log handler (unused in this implementation).
   * @param _level - The log severity level.
   * @param _message - The log message text.
   */
  log(_level: LogLevel, _message: string): void {}

  /** Critical severity (no-op). */
  crit(_message: string): void {}

  /** Error severity (no-op). */
  error(_message: string): void {}

  /** Warning severity (no-op). */
  warn(_message: string): void {}

  /** Informational severity (no-op). */
  info(_message: string): void {}

  /** Debug severity (no-op). */
  debug(_message: string): void {}

  /** Trace severity (no-op). */
  trace(_message: string): void {}
}
