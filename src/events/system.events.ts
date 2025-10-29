import { log } from '@/config/logger.config';

class SystemLifecycleEvents {
  public static registerGracefulShutdown(PROCESS: NodeJS.Process, start: number): void {
    const logExit = (signal: string) => {
      const duration = (performance.now() - start).toFixed(2);
      log.info(
        { context: SystemLifecycleEvents.name, signal, duration },
        `[exit] ${signal} received after ${duration}ms — shutting down gracefully...`,
      );
    };

    PROCESS.on('SIGINT', async () => {
      logExit('SIGINT');
      PROCESS.exit(0);
    });

    PROCESS.on('SIGTERM', () => {
      logExit('SIGTERM');
      PROCESS.exit(0);
    });

    PROCESS.on('exit', () => {
      const uptime = (performance.now() - start).toFixed(2);
      log.info(
        { context: SystemLifecycleEvents.name, uptime },
        `[shutdown] process exited after ${uptime}ms`,
      );
    });

    PROCESS.on('unhandledRejection', (reason: any) => {
      if (reason?.name === 'ConnectionError') return;

      log.error({ context: SystemLifecycleEvents.name, reason }, '[unhandled] promise rejection');
      PROCESS.exit(0);
    });
  }
}

export class System {
  public static LifecycleEvents = SystemLifecycleEvents;
}
