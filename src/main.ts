/**
 * @fileoverview Application bootstrap for the Twitch Chatbot.
 * @module main
 * @description
 *  Initializes the core runtime, registers lifecycle handlers,
 *  and connects the TMI (Twitch Messaging Interface) client.
 *  Provides structured startup and error logs, and ensures
 *  graceful shutdown of all registered subsystems.
 *
 * @example
 *  // Entry point executed at runtime
 *  // Registers graceful shutdown and connects to Twitch
 *  import './src/main.ts';
 */

import { TMI } from '@/events/tmi.events';
import { client } from '@/config/tmi.config';
import { System } from '@/events/system.events';
import { log } from '@/config/pino.config';
import { ChatbotQueueManager } from '@/queues/chatbot.queue';

/**
 * High-resolution startup timestamp.
 * Used to calculate duration for startup and shutdown logs.
 */
const start = performance.now();

/**
 * Bootstraps the Twitch chatbot runtime.
 *
 * @remarks
 *  The bootstrap sequence performs the following steps:
 *  1. Registers process signal handlers for graceful shutdown.
 *  2. Initializes the Twitch Messaging Interface (TMI) client.
 *  3. Optionally starts system heartbeat monitoring.
 *
 * @throws
 *  Logs and terminates the process if initialization fails.
 *
 * @returns {Promise<void>} Resolves once the startup sequence completes successfully.
 */
async function bootstrap(): Promise<void> {
  const context = 'Startup';
  log.info({ context }, '[start] startup sequence initiated...');

  // Register signal listeners and define subsystems for graceful shutdown.
  System.LifecycleEvents.registerGracefulShutdown(process, start, [
    { name: 'Heartbeat', stop: async () => System.Heartbeat.stop() },
    { name: 'ChatbotQueue', stop: async () => ChatbotQueueManager.shutdown() },
  ]);

  // Initialize Twitch Messaging Interface connection.
  await TMI.LifecycleEvents.initiatePlugin(client);
  await ChatbotQueueManager.init();

  // Optional: enable periodic heartbeat monitoring.
  // System.Heartbeat.start(undefined, '0 * * * * *', start);

  const duration = (performance.now() - start).toFixed(2);
  log.info(
    { context, duration },
    `[ready] startup sequence completed successfully in ${duration}ms`,
  );
}

/**
 * Global bootstrap call wrapped in fail-fast handling.
 * Any uncaught startup error will be logged and terminate the process gracefully.
 */
bootstrap().catch((err) => {
  const context = 'Startup';
  const duration = (performance.now() - start).toFixed(2);

  log.error(
    { context, reason: err.message ?? err, duration },
    `[stop] startup sequence failed after ${duration}ms`,
  );

  process.exit(0);
});
