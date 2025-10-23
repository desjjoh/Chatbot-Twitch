import type { ChatUserstate } from 'tmi.js';

import Log from '../queues/logger.queue';

class TMIEventListeners {
  public static async onConnecting(address: string, port: number): Promise<void> {
    console.log(`[connecting] → ${address}:${port}`);

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: `[connecting] → ${address}:${port}`,
      context: TMIEventListeners.name,
    });
  }

  public static async onLogon(): Promise<void> {
    console.log('[logon] sending authentication…');

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: '[logon] sending authentication…',
      context: TMIEventListeners.name,
    });
  }

  public static async onConnected(address: string, port: number): Promise<void> {
    console.log(`[connected] ✅ ${address}:${port}`);

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: `[connected] ✅ ${address}:${port}`,
      context: TMIEventListeners.name,
    });
  }

  public static async onJoin(channel: string, username: string, self: boolean): Promise<void> {
    if (!self) return;
    console.log(`[join] 🎉 joined ${channel} as ${username}`);

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: `[join] 🎉 joined ${channel} as ${username}`,
      context: TMIEventListeners.name,
    });
  }

  public static async onDisconnected(reason: string): Promise<void> {
    console.log(`[disconnected] ⚠️ reason: ${reason}`);

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: `[disconnected] ⚠️ reason: ${reason}`,
      context: TMIEventListeners.name,
    });
  }

  public static async onReconnect(): Promise<void> {
    console.log('[reconnect] attempting to reconnect…');

    await Log({
      timestamp: Date.now(),
      level: 'info',
      message: '[reconnect] attempting to reconnect…',
      context: TMIEventListeners.name,
    });
  }

  public static async onMessage(
    channel: string,
    userstate: ChatUserstate,
    message: string,
    self: boolean,
  ): Promise<void> {
    if (!self) return;

    console.log(`[${channel}] <${userstate['display-name']}>: ${message}`);
  }
}

export class TMI {
  public static EventListeners = TMIEventListeners;
}
