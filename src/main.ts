import { TMI } from './events/tmi.events';
import { client } from './config/tmi.config';

function bootstrap() {
  client.on('connecting', TMI.EventListeners.onConnecting);
  client.on('logon', TMI.EventListeners.onLogon);
  client.on('connected', TMI.EventListeners.onConnected);
  client.on('join', TMI.EventListeners.onJoin);
  client.on('disconnected', TMI.EventListeners.onDisconnected);
  client.on('reconnect', TMI.EventListeners.onReconnect);
  client.on('message', TMI.EventListeners.onMessage);

  client.connect().catch(console.error);
}

bootstrap();
