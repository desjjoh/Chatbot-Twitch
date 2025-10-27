import { TMI } from './events/tmi.events';
import { client } from './config/tmi.config';

function bootstrap(): void {
  TMI.initiatePlugin(client);
}

bootstrap();
