import { Client } from 'tmi.js'

import { chatbotQueue, actions } from '../services/chatbot.js'
import { loggerQueue } from '../services/logger.js'

const { CHANNEL_NAME, USERNAME, PASSWORD } = process.env

const chatClient = new Client({
  options: { debug: true, reconnect: true, secure: true },
  identity: {
    username: USERNAME,
    password: PASSWORD
  },
  channels: [CHANNEL_NAME]
})

chatClient.on('connecting', (address, port) => {
  const $message = `info: Connecting to ${address} on port ${port}..`
  loggerQueue.add({ $message })
})
chatClient.on('logon', () => {
  const $message = 'info: Sending authentication to server..'
  loggerQueue.add({ $message })
})
chatClient.on('connected', (address, port) => {
  const $message = 'info: Connected to server.'
  loggerQueue.add({ $message })
})

chatClient.on('message', (channel, tags, message, self) => {
  const $message = `info: [${channel}] <${tags.username}>: ${message}`
  loggerQueue.add({ $message })

  if (self || !message.startsWith('!')) return
  const payload = { action: actions.CHAT_COMMAND, channel, tags, message, self }
  chatbotQueue.add(payload, { attempts: 3 })
})

export { chatClient }
