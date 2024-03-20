import { ChatUserstate } from 'tmi.js'

import { logger } from '../queues/logger.queue.ts'

import { LoggerActions } from '../../lib/enums/logger.enums.ts'
import { ChatbotActions } from '../../lib/enums/chat.enums.ts'
import chatbot from '../queues/chat.queue.ts'

class EventListeners {
  public static onConnecting(address: string, port: number): void {
    const message = `Connecting to ${address} on port ${port}..`
    logger.add({ action: LoggerActions.INFO, message })
  }

  public static onLogon(): void {
    const message = `Sending authentication to server..`
    logger.add({ action: LoggerActions.INFO, message })
  }

  public static onConnected(_address: string, _port: number): void {
    const message = `Connected to server.`
    logger.add({ action: LoggerActions.INFO, message })
  }

  public static onJoin(channel: string, username: string, self: boolean): void {
    if (!self) return

    const message = `Joined ${channel}`
    logger.add({ action: LoggerActions.INFO, message })

    chatbot.add({
      action: ChatbotActions.SEND_MSG,
      channel,
      message: `Hi I'm ${username}! How may I help you today?`
    })
  }

  public static onDisconnected(reason: string): void {
    const message = `Disconnected from server. Reason: ${reason}.`
    logger.add({ action: LoggerActions.ERROR, message })
  }

  public static onReconnect(): void {
    const message = 'Reconnected to server.'
    logger.add({ action: LoggerActions.INFO, message })
  }

  public static onMessage(channel: string, userstate: ChatUserstate, message: string, self: boolean): void {
    if (self || !message.startsWith('!')) return

    logger.add({ action: LoggerActions.INFO, message: `[@${userstate.username}] "${message}"` })
    chatbot.add({ action: ChatbotActions.ACTION_CMD, channel, message, userstate })
  }
}

class TMIService {
  public static EventListeners = EventListeners
}

export default TMIService
