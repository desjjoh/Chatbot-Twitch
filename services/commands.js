import { logger } from '../queues/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { dehash } from '../utils/formatter.js'

import { apiClient } from '../plugins/twurple.js'

const { AUTHOR, USERNAME, GITHUB } = process.env

const commands = {
  about: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested !${command}. I'm ${USERNAME}, a TwitchTV chat bot developed in NodeJS by twitch user ${AUTHOR} in December of 2023. 
      My source code can be found @ [${GITHUB}].`
    })
  },
  commands: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const LIST = Object.keys(commands)
      .map((key) => `!${key}`)
      .join(' ')

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested !${command}. Here is a list of all available commands: ${LIST}`
    })
  },
  game: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const STREAM = await apiClient.streams.getStreamByUserName(dehash(channel))
    const game = STREAM?.gameName

    if (!game) {
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Current game could not be found.`
      })
      return
    }

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested !${command}. The current game is set to ${game}.`
    })
  }
}

async function chatCommand(payload) {
  const { message, tags, channel } = payload
  const { username } = tags

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  const event = commands[command]

  if (!event) {
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your request could not be completed. [Reason] Command !${command} has not been initialized.`
    })
    return
  }

  const data = { ...payload, $command: [raw, command, argument] }
  await event(data)
}

export { chatCommand, commands }
