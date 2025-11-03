/**
 * @fileoverview Twitch Messaging Interface (TMI) event listeners and lifecycle manager.
 * @module events/tmi
 * @description
 *  Defines the event binding layer between the Twitch IRC client (`tmi.js`)
 *  and the system's structured logging framework. Handles connection, authentication,
 *  message, and lifecycle events, providing consistent observability for all Twitch
 *  chat interactions.
 *
 * @remarks
 *  - Logs all IRC connection and chat events with structured context.
 *  - Encapsulates initialization and connection lifecycle in `TMILifecycleEvents`.
 *  - Prevents duplicate event registrations through static event handlers.
 *
 * @example
 *  import { TMI } from '@/events/tmi.events';
 *  import { client } from '@/config/tmi.config';
 *
 *  await TMI.LifecycleEvents.initiatePlugin(client);
 */

import type { ChatUserstate, Client } from 'tmi.js';
import { log } from '@/config/pino.config';

/**
 * Collection of static event handlers for Twitch IRC (TMI) events.
 * Each handler logs structured information about connection and chat activity.
 */
class TMIEventListeners {
  /**
   * Fired when the client begins connecting to the IRC server.
   *
   * @param address - Server address being connected to.
   * @param port - Port used for the connection.
   */
  public static onConnecting(address: string, port: number): void {
    log.info({ context: TMIEventListeners.name, address, port }, `[connecting] ${address}:${port}`);
  }

  /**
   * Fired when authentication is being sent to the Twitch IRC server.
   */
  public static onLogon(): void {
    log.info({ context: TMIEventListeners.name }, '[logon] sending authentication...');
  }

  /**
   * Fired once the client successfully connects to the IRC server.
   *
   * @param address - Server address connected to.
   * @param port - Port used for the connection.
   */
  public static onConnected(address: string, port: number): void {
    log.info({ context: TMIEventListeners.name, address, port }, `[connected] ${address}:${port}`);
  }

  /**
   * Fired when a channel is joined successfully.
   *
   * @param channel - The channel name (e.g., #k3nata8).
   * @param username - The username that joined the channel.
   * @param self - Whether the client itself joined.
   */
  public static onJoin(channel: string, username: string, self: boolean): void {
    if (!self) return;
    log.info(
      { context: TMIEventListeners.name, channel, username, self },
      `[join] joined ${channel} as ${username}`,
    );
  }

  /**
   * Fired when the client disconnects from the IRC server.
   *
   * @param reason - Human-readable reason for the disconnection.
   */
  public static onDisconnected(reason: string): void {
    log.warn({ context: TMIEventListeners.name, reason }, `[disconnected] reason: ${reason}`);
  }

  /**
   * Fired when the client attempts to reconnect to the IRC server.
   */
  public static onReconnect(): void {
    log.info({ context: TMIEventListeners.name }, '[reconnect] attempting to reconnect…');
  }

  /**
   * Fired when a message is received in chat.
   *
   * @param channel - The channel name where the message was received.
   * @param userstate - Twitch user metadata for the message sender.
   * @param message - The message text.
   * @param self - Whether the message was sent by the bot itself.
   */
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

/**
 * Manages the TMI client's lifecycle — event registration and connection handling.
 * Encapsulates startup logic for the Twitch Messaging Interface.
 */
class TMILifecycleEvents {
  /**
   * Registers all IRC event listeners and connects the TMI client.
   *
   * @param client - The preconfigured TMI client instance.
   * @returns {Promise<void>} Resolves once connection completes successfully.
   *
   * @example
   *  await TMILifecycleEvents.initiatePlugin(client);
   */
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

/**
 * Root namespace for Twitch Messaging Interface integration.
 * Combines event listener definitions and lifecycle management.
 */
export class TMI {
  /** Static reference to all Twitch IRC event handlers. */
  public static EventListeners = TMIEventListeners;

  /** Lifecycle controller for initialization and connection management. */
  public static LifecycleEvents = TMILifecycleEvents;
}
