import { TMI } from '@/events/tmi.events';
import { client } from '@/config/tmi.config';
import { System } from '@/events/system.events';
import { log } from '@/config/pino.config';

const start = performance.now();

async function bootstrap(): Promise<void> {
  const context = 'Startup';

  log.info({ context }, '[start] startup sequence initiated...');

  System.LifecycleEvents.registerGracefulShutdown(process, start);
  await TMI.LifecycleEvents.initiatePlugin(client);

  const duration = (performance.now() - start).toFixed(2);
  log.info(
    { context, duration },
    `[ready] startup sequence completed successfully in ${duration}ms`,
  );
}

bootstrap().catch((err) => {
  const context = 'Startup';
  const duration = (performance.now() - start).toFixed(2);
  log.error(
    { context, reason: err.message ?? err, duration },
    `[stop] startup sequence failed after ${duration}ms`,
  );
  process.exit(0);
});
