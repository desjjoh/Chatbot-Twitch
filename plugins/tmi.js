import { Client } from 'tmi.js'

import moment from 'moment'

import { chatbot, actions } from '../queues/chatbot.js'
import { logger } from '../queues/logger.js'
import { mins2ms } from '../utils/formatter.js'

const { CHANNEL_NAME, USERNAME, PASSWORD, JOIN_MSG, SOCIALS_MSG } = process.env

//#region Config
const CONFIG = {
  options: {
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
//#endregion

//#region Functions
async function sendChat(payload) {
  const { channel, message } = payload
  const now = moment().format('HH:mm')

  await client.say(channel, `[${now}] ${message}`)

  const $message = `info: [${channel}] <${USERNAME}>: ${message}`
  logger.add({ $message })
}
//#endregion

//#region Event Listeners
client.on('connecting', (address, port) => {
  const $message = `info: Connecting to ${address} on port ${port}..`
  logger.add({ $message })
})

client.on('logon', () => {
  const $message = 'info: Sending authentication to server..'
  logger.add({ $message })
})

client.on('connected', (_address, _port) => {
  const $message = 'info: Connected to server.'
  logger.add({ $message })
})

client.on('join', (channel, username) => {
  if (username !== client.getUsername()) return

  const $message = `info: Joined ${channel}`
  logger.add({ $message })

  const payload = {
    action: actions.SEND_CHAT,
    channel
  }

  chatbot.add({ ...payload, message: JOIN_MSG })
  chatbot.add({ ...payload, message: SOCIALS_MSG }, { delay: mins2ms(0.25) })

  // { repeat: { every: mins2ms(15) } }
  chatbot.add(
    { ...payload, message: SOCIALS_MSG },
    { repeat: { cron: '*/15 * * * *' } }
  )
})

client.on('disconnected', (reason) => {
  const $message = `error: Disconnected from server. [Reason]: ${reason}`
  logger.add({ $message })
})

client.on('reconnect', () => {
  const $message = 'info: Reconnected to server.'
  logger.add({ $message })
})

client.on('logon', () => {
  const $message = 'info: Sending authentication to server..'
  logger.add({ $message })
})

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return
  const payload = { action: actions.CHAT_COMMAND, channel, tags, message, self }
  chatbot.add(payload, { attempts: 3 })
})
//#endregion

export { client, sendChat }
