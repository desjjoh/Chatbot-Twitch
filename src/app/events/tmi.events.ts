import { ChatUserstate } from 'tmi.js'

import { logger } from '../queues/logger.queue.ts'

import { LoggerActions } from '../../lib/enums/logger.enums.ts'
import { ChatbotActions } from '../../lib/enums/chat.enums.ts'
import chatbot from '../queues/chat.queue.ts'

function onConnecting(address: string, port: number): void {
  const message = `Connecting to ${address} on port ${port}..`
  logger.add({ action: LoggerActions.INFO, message })
}

function onLogon(): void {
  const message = `Sending authentication to server..`
  logger.add({ action: LoggerActions.INFO, message })
}

function onConnected(_address: string, _port: number): void {
  const message = `Connected to server.`
  logger.add({ action: LoggerActions.INFO, message })
}

function onJoin(channel: string, _username: string, self: boolean): void {
  if (!self) return

  const message = `Joined ${channel}`
  logger.add({ action: LoggerActions.INFO, message })

  // chatbot.add({
  //   action: ChatbotActions.SEND_MSG,
  //   channel,
  //   message: `Hi I'm ${username}! How may I help you today?`
  // })
}

function onDisconnected(reason: string): void {
  const message = `Disconnected from server. Reason: ${reason}.`
  logger.add({ action: LoggerActions.ERROR, message })
}

function onReconnect(): void {
  const message = 'Reconnected to server.'
  logger.add({ action: LoggerActions.INFO, message })
}

function onMessage(channel: string, userstate: ChatUserstate, message: string, self: boolean): void {
  if (self || !message.startsWith('!')) return

  logger.add({ action: LoggerActions.INFO, message: `[@${userstate.username}] "${message}"` })
  chatbot.add({ action: ChatbotActions.ACTION_CMD, channel, message, userstate })
}

export { onConnecting, onLogon, onConnected, onJoin, onDisconnected, onReconnect, onMessage }
