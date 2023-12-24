import { loggerQueue } from '../services/logger.js'

import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

const commands = {
  GAME: 'game'
}

async function $game(payload) {
  const { CHANNEL_NAME } = process.env

  const data = {}
  const stream = await apiClient.streams.getStreamByUserName(CHANNEL_NAME)

  if (!stream?.gameName) {
    data = { channel: CHANNEL_NAME, message: '' }
    sendChat(data)
    return
  }

  data = { channel: CHANNEL_NAME, message: '' }
  sendChat(data)
}

async function chatCommand(payload) {
  const { message } = payload

  const args = message.slice(1).split(' ')
  const key = args.shift().toLowerCase()

  const $message = `info: [${channel}] <${tags.username}>: ${message}`
  loggerQueue.add({ $message })

  switch (key) {
    case commands.GAME:
      $game(payload)
      break
    default:
  }
}

export { chatCommand }
