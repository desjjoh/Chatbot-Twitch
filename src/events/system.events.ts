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
  public static registerGracefulShutdown(
    PROCESS: NodeJS.Process,
    start: number,
    services: Array<{ name: string; stop: () => Promise<void> | void }> = [],
  ): void {
    const context = SystemLifecycleEvents.name;

    const shutdown = async (signal: string): Promise<void> => {
      const duration = (performance.now() - start).toFixed(2);
      log.info(
        { context, signal, duration },
        `[exit] ${signal} received — shutting down gracefully...`,
      );

      try {
        for (const service of services) {
          const t0 = performance.now();
          try {
            await service.stop();
            const took = (performance.now() - t0).toFixed(2);
            log.info(
              { context, service: service.name, took },
              `[exit] ${service.name} stopped successfully (${took}ms)`,
            );
          } catch (err) {
            log.error(
              {
                context,
                service: service.name,
                reason: err instanceof Error ? err.message : String(err),
              },
              `[exit] failed to stop ${service.name}`,
            );
          }
        }

        const total = (performance.now() - start).toFixed(2);
        log.info({ context, total }, `[exit] shutdown complete in ${total}ms`);
      } catch (err) {
        log.error(
          { context, reason: err instanceof Error ? err.message : String(err) },
          '[exit] error during shutdown — forcing exit',
        );
      } finally {
        PROCESS.exit(0);
      }
    };

    PROCESS.on('SIGINT', async () => void shutdown('SIGINT'));
    PROCESS.on('SIGTERM', () => void shutdown('SIGTERM'));
    PROCESS.on('unhandledRejection', (reason: any) => {
      if (reason?.name === 'ConnectionError') return;

      log.error({ context, reason }, '[unhandled] promise rejection');
      void shutdown('unhandledRejection');
    });

    PROCESS.on('exit', () => {
      const uptime = (performance.now() - start).toFixed(2);
      log.info({ context, uptime }, `[shutdown] process exited after ${uptime}ms`);
    });
  }
}

export class System {
  public static LifecycleEvents = SystemLifecycleEvents;
  public static Heartbeat = SystemHeartbeat;
}
