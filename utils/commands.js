import { chatClient } from '../plugins/tmi.js'
import { loggerQueue } from '../services/logger.js'
import { apiClient } from '../plugins/twurple.js'

const commands = {
  GAME: 'game'
}

async function chatCommand(payload) {
  const { message } = payload.data

  const args = message.slice(1).split(' ')

  const key = args.shift().toLowerCase()
  const value = args.join(' ')

  switch (key) {
    case commands.GAME:
      $game(payload)
      break
    default:
  }
}

async function $game(payload) {
  const { CHANNEL_NAME } = process.env
  const stream = await apiClient.streams.getStreamByUserName(CHANNEL_NAME)

  const message = stream?.gameName ? '' : ''
  if (!message) return

  const data = { channel: CHANNEL_NAME, message }
  sendChat({ data })
}

async function sendChat(payload) {
  const { channel, message } = payload.data

  await chatClient.say(channel, message)
}

export { chatCommand, sendChat }
