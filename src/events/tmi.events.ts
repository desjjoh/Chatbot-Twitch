import type { ChatUserstate, Client } from 'tmi.js';

import { log } from '@/config/logger.config';

class TMIEventListeners {
  public static onConnecting(address: string, port: number): void {
    log.info({ context: TMIEventListeners.name, address, port }, `[connecting] ${address}:${port}`);
  }

  public static onLogon(): void {
    log.info({ context: TMIEventListeners.name }, '[logon] sending authentication...');
  }

  public static onConnected(address: string, port: number): void {
    log.info({ context: TMIEventListeners.name, address, port }, `[connected] ${address}:${port}`);
  }

  public static onJoin(channel: string, username: string, self: boolean): void {
    if (!self) return;
    log.info(
      { context: TMIEventListeners.name, channel, username, self },
      `[join] joined ${channel} as ${username}`,
    );
  }

  public static onDisconnected(reason: string): void {
    log.warn({ context: TMIEventListeners.name, reason }, `[disconnected] reason: ${reason}`);
  }

  public static onReconnect(): void {
    log.info({ context: TMIEventListeners.name }, '[reconnect] attempting to reconnect…');
  }

  public static onMessage(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ): void {
    log.info(
      { context: TMIEventListeners.name, channel, userstate, message, self },
      `[${channel}] <${userstate['display-name']}>: ${message}`,
    );
  }
}

class TMILifecycleEvents {
  public static async initiatePlugin(client: Client): Promise<void> {
    client.on('connecting', TMIEventListeners.onConnecting);
    client.on('logon', TMIEventListeners.onLogon);
    client.on('connected', TMIEventListeners.onConnected);
    client.on('join', TMIEventListeners.onJoin);
    client.on('disconnected', TMIEventListeners.onDisconnected);
    client.on('reconnect', TMIEventListeners.onReconnect);
    client.on('message', TMIEventListeners.onMessage);

    await client.connect();
  }
}

export class TMI {
  public static EventListeners = TMIEventListeners;
  public static LifecycleEvents = TMILifecycleEvents;
}
