import { Logger, LogLevel } from '@d-fischer/logger';

export class NullLogger implements Logger {
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
