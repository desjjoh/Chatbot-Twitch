import { log } from '@/config/pino.config';
import { Logger, LogLevel } from '@d-fischer/logger';

export class TMILogger implements Logger {
  minLevel = LogLevel.TRACE;
  name = 'TMI';

  private shouldLog(level: LogLevel): boolean {
    return level <= this.minLevel;
  }

  private msg(message: string): string {
    return `[logger] ${message}`;
  }

  log(level: LogLevel, message: string): void {
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

  crit(message: string): void {
    if (this.shouldLog(LogLevel.CRITICAL))
      log.fatal({ context: TMILogger.name }, this.msg(message));
  }

  error(message: string): void {
    if (this.shouldLog(LogLevel.ERROR)) log.error({ context: TMILogger.name }, this.msg(message));
  }

  warn(message: string): void {
    if (this.shouldLog(LogLevel.WARNING)) log.warn({ context: TMILogger.name }, this.msg(message));
  }

  info(message: string): void {
    if (this.shouldLog(LogLevel.INFO)) log.info({ context: TMILogger.name }, this.msg(message));
  }

  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) log.debug?.({ context: TMILogger.name }, this.msg(message));
  }

  trace(message: string): void {
    if (this.shouldLog(LogLevel.TRACE)) log.trace?.({ context: TMILogger.name }, this.msg(message));
  }
}
