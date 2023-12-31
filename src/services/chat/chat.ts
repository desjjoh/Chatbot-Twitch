import Bull from 'bull'

import { ChatbotPayloadType, ISendChat } from '../../lib/types/chat.ts'

import { useChatbotResolver } from './chat.resolvers.ts'
import * as EVENTS from './chat.listeners.ts'

import client from '../../plugins/tmi.ts'
import dataSource from '../../plugins/typeorm.ts'

const CONFIG: Bull.QueueOptions = { limiter: { max: 1, duration: 3000 } }
const chatbot: Bull.Queue<ChatbotPayloadType> = new Bull<ChatbotPayloadType>('chatbot', CONFIG)

async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message)
}

// Initialize Chat Bot Application
async function initChat(): Promise<void> {
  // Set TMI.js Event Listeners
  // Authentication Events
  client.on('connecting', EVENTS.onConnecting)
  client.on('logon', EVENTS.onLogon)
  client.on('connected', EVENTS.onConnected)
  client.on('join', EVENTS.onJoin)
  client.on('disconnected', EVENTS.onDisconnected)
  client.on('reconnect', EVENTS.onReconnect)

  // Channel Events
  client.on('message', EVENTS.onMessage)
  client.on('raided', EVENTS.onRaided)
  client.on('redeem', EVENTS.onRedeem)
  client.on('subscription', EVENTS.onSubscription)
  client.on('resub', EVENTS.onReSub)
  client.on('ban', EVENTS.onBan)
  client.on('timeout', EVENTS.onTimeout)
  client.on('messagedeleted', EVENTS.onMessageDeleted)
  client.on('subgift', EVENTS.onSubGift)
  client.on('submysterygift', EVENTS.onSubMysteryGift)

  // Initialize Plugins
  await dataSource.initialize()
  await client.connect()
}

await chatbot.empty()
chatbot.process(useChatbotResolver)

export { chatbot, sendChat, initChat }
