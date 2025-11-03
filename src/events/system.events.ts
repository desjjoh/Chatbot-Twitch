/**
 * @fileoverview System-level heartbeat and lifecycle management.
 * @module system/events
 * @description
 *  Provides core utilities for process lifecycle control, including
 *  scheduled heartbeat logging, graceful shutdown coordination, and
 *  unhandled error management. Central to observability and uptime tracking.
 *
 * @remarks
 *  - Heartbeat emits periodic uptime logs for monitoring.
 *  - Lifecycle manager handles SIGINT, SIGTERM, and unhandled rejections.
 *  - Supports pluggable services with their own shutdown hooks.
 *
 * @example
 *  import { System } from '@/events/system.events';
 *
 *  System.LifecycleEvents.registerGracefulShutdown(process, start, [
 *    { name: 'Heartbeat', stop: async () => System.Heartbeat.stop() },
 *    { name: 'ChatbotQueue', stop: async () => ChatbotQueueManager.shutdown() },
 *  ]);
 *
 * System.Heartbeat.start(undefined, '* * * * * *', start);
 */

import { log } from '@/config/pino.config';
import * as cron from 'node-cron';

/**
 * Provides a recurring system heartbeat for monitoring uptime and runtime health.
 * Logs a tick event at a defined cron interval, optionally executing a callback.
 */
class SystemHeartbeat {
  /** The currently active cron task, if any. */
  private static task: cron.ScheduledTask | null = null;

  /**
   * Starts the heartbeat scheduler.
   *
   * @param callback - Optional callback executed each tick.
   * @param cronExpr - Cron expression defining tick frequency (default: once per minute).
   * @param start - High-resolution startup timestamp for uptime tracking.
   */
  public static start(
    callback?: () => Promise<void> | void,
    cronExpr = '* * * * *',
    start: number = performance.now(),
  ): void {
    const context = SystemHeartbeat.name;
    if (this.task) return;

    this.task = cron.schedule(cronExpr, async () => {
      const uptime = (performance.now() - start).toFixed(2);

      try {
        if (callback) await callback();
        log.info({ context, uptime }, `[heartbeat] tick - uptime=${uptime}ms`);
      } catch (err: unknown) {
        log.error(
          {
            context,
            reason: err instanceof Error ? err.message : String(err),
            uptime,
          },
          '[heartbeat] tick failed',
        );
      }
    });
  }

  /**
   * Stops the heartbeat scheduler, preventing further ticks.
   */
  public static stop(): void {
    const context = SystemHeartbeat.name;
    if (!this.task) return;

    this.task.stop();
    this.task = null;
    log.info({ context }, '[heartbeat] stopped');
  }
}

/**
 * Coordinates system shutdown, ensuring all registered services
 * terminate gracefully and log their exit durations.
 */
class SystemLifecycleEvents {
  /**
   * Registers signal listeners and orchestrates graceful shutdown for all services.
   *
   * @param PROCESS - The active Node.js process.
   * @param start - High-resolution startup timestamp for duration measurement.
   * @param services - Array of service objects, each exposing a `stop()` method.
   *
   * @example
   *  System.LifecycleEvents.registerGracefulShutdown(process, start, [
   *    { name: 'Heartbeat', stop: async () => System.Heartbeat.stop() },
   *  ]);
   */
  public static registerGracefulShutdown(
    PROCESS: NodeJS.Process,
    start: number,
    services: Array<{ name: string; stop: () => Promise<void> | void }> = [],
  ): void {
    const context = SystemLifecycleEvents.name;

    /**
     * Executes the shutdown sequence for all registered services.
     * @param signal - The triggering signal name (e.g., SIGINT, SIGTERM).
     */
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

    // Signal handlers
    PROCESS.on('SIGINT', async () => void shutdown('SIGINT'));
    PROCESS.on('SIGTERM', () => void shutdown('SIGTERM'));

    // Handle unhandled promise rejections
    PROCESS.on('unhandledRejection', (reason: any) => {
      if (reason?.name === 'ConnectionError') return;
      log.error({ context, reason }, '[unhandled] promise rejection');
      void shutdown('unhandledRejection');
    });

    // Log process exit uptime
    PROCESS.on('exit', () => {
      const uptime = (performance.now() - start).toFixed(2);
      log.info({ context, uptime }, `[shutdown] process exited after ${uptime}ms`);
    });
  }
}

/**
 * Root system namespace exposing core lifecycle and heartbeat controls.
 * Provides global entry points for process management and observability.
 */
export class System {
  /** Handles process signals and service shutdown. */
  public static LifecycleEvents = SystemLifecycleEvents;

  /** Provides a recurring uptime heartbeat log. */
  public static Heartbeat = SystemHeartbeat;
}
