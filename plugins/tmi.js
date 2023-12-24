import { Client } from 'tmi.js'

import { chatbotQueue, actions } from '../services/chatbot.js'
import { loggerQueue } from '../services/logger.js'

// TMI CHAT CLIENT CONFIG
const { CHANNEL_NAME, USERNAME, PASSWORD } = process.env
const CONFIG = {
  options: { debug: true, reconnect: true, secure: true },
  identity: {
    username: USERNAME,
    password: PASSWORD
  },
  channels: [CHANNEL_NAME]
}

const client = new Client(CONFIG)

// FUNCTION USED TO SEND CHAT MESSAGE
async function sendChat(payload) {
  const { channel, message } = payload

  const $message = `info: [${channel}] <${USERNAME}>: ${message}`
  loggerQueue.add({ $message })

  await client.say(channel, message)
}

// ON CLIENT CONNECTING EVENT LISTENER
client.on('connecting', (address, port) => {
  const $message = `info: Connecting to ${address} on port ${port}..`
  loggerQueue.add({ $message })
})

// ON CLIENT AUTHENTICATION EVENT LISTENER
client.on('logon', () => {
  const $message = 'info: Sending authentication to server..'
  loggerQueue.add({ $message })
})

// ON CLIENT CONNECTED EVENT LISTENER
client.on('connected', (address, port) => {
  const $message = 'info: Connected to server.'
  loggerQueue.add({ $message })
})

// ON CHANNEL JOIN EVENT LISTENER
client.on('join', (channel, username) => {
  if (username !== client.getUsername()) return

  const $message = `info: Joined ${channel}`
  loggerQueue.add({ $message })

  const payload = {
    action: actions.SEND_CHAT,
    channel
  }

  chatbotQueue.add({ ...payload, message: 'This is a test message!' })
  chatbotQueue.add(
    { ...payload, message: 'This is a test message!' },
    { repeat: { cron: '*/15 * * * *' } }
  )
})

// ON MESSAGE RECIEVED EVENT LISTENER
client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return
  const payload = { action: actions.CHAT_COMMAND, channel, tags, message, self }
  chatbotQueue.add(payload, { attempts: 3 })
})

export { client, sendChat }
