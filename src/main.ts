import { TMI } from '@/events/tmi.events';
import { client } from '@/config/tmi.config';
import { System } from '@/events/system.events';
import { log } from '@/config/logger.config';

const start = performance.now();

async function bootstrap(): Promise<void> {
  const context = 'Startup';

  log.info({ context }, '[startup] startup sequence initiated...');

  System.LifecycleEvents.registerGracefulShutdown(process, start);
  await TMI.LifecycleEvents.initiatePlugin(client);

  const duration = (performance.now() - start).toFixed(2);
  log.info({ context, duration }, `[startup] completed successfully in ${duration}ms`);
}

bootstrap().catch((err) => {
  const context = 'Startup';
  const duration = (performance.now() - start).toFixed(2);
  log.error({ context, reason: err.message ?? err }, `[startup] failed after ${duration}ms`);
  process.exit();
});
