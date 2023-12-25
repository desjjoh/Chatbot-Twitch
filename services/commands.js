import { logger } from '../queues/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { dehash, capitalize } from '../utils/formatter.js'
import {
  about,
  commands,
  followage,
  game,
  tags,
  title,
  uptime
} from '../functions/index.js'

const COMMANDS = {
  about,
  commands,
  followage,
  game,
  tags,
  title,
  uptime
}

async function chatCommand(payload) {
  const { message, tags, channel } = payload
  const username = capitalize(tags.username)

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\S+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  const event = COMMANDS[command]

  if (!event)
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your request could not be completed. [Reason] Command !${command} has not been initialized.`
    })
  else
    await event({
      ...payload,
      $command: [raw, command, argument ? argument.trim() : argument]
    })
}

export { chatCommand, commands }
