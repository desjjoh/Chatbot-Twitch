import { logger } from '../services/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { commands } from '../config/commands.constants.js'
import { dehash } from './formatter.js'

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
      message: `Sorry @${username}. Your request could not be completed. [Reason]: !${command} is not initialized.`
    })
    return
  }

  const data = { ...payload, $command: [raw, command, argument] }
  await event(data)
}

export { chatCommand }
