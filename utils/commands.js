import { loggerQueue } from '../services/logger.js'

import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

const commands = {
  GAME: 'game'
}

async function $game(payload) {
  const { tags } = payload
  const { username } = tags

  const { CHANNEL_NAME } = process.env

  const data = { channel: CHANNEL_NAME, message: undefined }
  const stream = await apiClient.streams.getStreamByUserName(CHANNEL_NAME)

  if (!stream?.gameName) {
    sendChat({
      ...data,
      message: `Sorry @${username}. Your !game request could not be completed`
    })
    return
  }

  sendChat({ ...data, message: '' })
}

async function chatCommand(payload) {
  const { message, channel, tags } = payload

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
