import { log } from '@/config/pino.config';
import * as cron from 'node-cron';

class SystemHeartbeat {
  private static task: cron.ScheduledTask | null = null;

  public static start(
    callback?: () => Promise<void> | void,
    cronExpr = '* * * * *',
    start: number = performance.now(),
  ): void {
    if (this.task) return;

    this.task = cron.schedule(cronExpr, async () => {
      const uptime = (performance.now() - start).toFixed(2);

      try {
        if (callback) await callback();
        log.info(
          { context: SystemHeartbeat.name, uptime },
          `[heartbeat] tick - uptime=${uptime}ms`,
        );
      } catch (err: unknown) {
        log.error(
          {
            context: SystemHeartbeat.name,
            reason: err instanceof Error ? err.message : String(err),
            uptime,
          },
          '[heartbeat] tick failed',
        );
      }
    });
  }

  public static stop() {
    if (!this.task) return;

    this.task.stop();
    this.task = null;

    log.info({ context: 'HeartbeatCron' }, '[heartbeat] stopped');
  }
}

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
  public static Heartbeat = SystemHeartbeat;
}
