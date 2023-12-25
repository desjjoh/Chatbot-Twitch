import { Client } from 'tmi.js'

import moment from 'moment'

import { chatbot, actions } from '../queues/chatbot.js'
import { logger } from '../queues/logger.js'

//#region Config
const { CHANNEL_NAME, TTV_USERNAME, PASSWORD } = process.env

const CONFIG = {
  options: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: TTV_USERNAME,
    password: PASSWORD
  },
  channels: [CHANNEL_NAME]
}

const client = new Client(CONFIG)
//#endregion

//#region Functions
const sendChat = async (payload) => {
  const { channel, message } = payload
  const now = moment().format('HH:mm')

  await client.say(channel, `[${now}] ${message}`)

  const $message = `info: [${channel}] <${TTV_USERNAME}>: ${message}`
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

  const JOIN_MSG = `Hi I'm @${TTV_USERNAME}! What can I help you with today?`
  const SOCIALS_MSG = `Hey there! If you're enjoying the stream, please consider following the stream for updates when we go live!`

  chatbot.add({ ...payload, message: JOIN_MSG })
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

client.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return
  const payload = { action: actions.CHAT_COMMAND, channel, tags, message, self }
  chatbot.add(payload, { attempts: 3 })
})
//#endregion

export { client, sendChat }
