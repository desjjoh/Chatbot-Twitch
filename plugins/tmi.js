import { Client } from 'tmi.js'

import moment from 'moment'

import { chatbot, actions } from '../services/chatbot.js'
import { logger } from '../services/logger.js'
import { mins2ms } from '../utils/formatter.js'

// TMI CHAT CLIENT CONFIG
const { CHANNEL_NAME, USERNAME, PASSWORD } = process.env
const CONFIG = {
  options: {
    // debug: true,
    reconnect: true,
    secure: true
  },
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
  const now = moment().format('HH:mm')

  await client.say(channel, `[${now}] ${message}`)

  const $message = `info: [${channel}] <${USERNAME}>: ${message}`
  logger.add({ $message })
}

// ON CLIENT CONNECTING EVENT LISTENER
client.on('connecting', (address, port) => {
  const $message = `info: Connecting to ${address} on port ${port}..`
  logger.add({ $message })
})

// ON CLIENT AUTHENTICATION EVENT LISTENER
client.on('logon', () => {
  const $message = 'info: Sending authentication to server..'
  logger.add({ $message })
})

// ON CLIENT CONNECTED EVENT LISTENER
client.on('connected', (address, port) => {
  const $message = 'info: Connected to server.'
  logger.add({ $message })
})

// ON CHANNEL JOIN EVENT LISTENER
client.on('join', (channel, username) => {
  if (username !== client.getUsername()) return

  const { JOIN_MSG, SOCIALS_MSG } = process.env
  const $message = `info: Joined ${channel}`
  logger.add({ $message })

  const payload = {
    action: actions.SEND_CHAT,
    channel
  }

  // BOT JOIN MESSAGE
  chatbot.add({ ...payload, message: JOIN_MSG })

  // REPEATED MESSAGES
  chatbot.add({ ...payload, message: SOCIALS_MSG }, { delay: mins2ms(0.25) })
  chatbot.add(
    { ...payload, message: SOCIALS_MSG },
    { repeat: { every: mins2ms(15) } }
  )
})

// ON MESSAGE RECIEVED EVENT LISTENER
client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return
  const payload = { action: actions.CHAT_COMMAND, channel, tags, message, self }
  chatbot.add(payload, { attempts: 3 })
})

export { client, sendChat }
