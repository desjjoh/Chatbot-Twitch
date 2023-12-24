import { logger } from '../services/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { commands } from './commands.constants.js'

async function chatCommand(payload) {
  const { message, tags } = payload
  const { username } = tags

  const { CHANNEL_NAME } = process.env

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  const event = commands[command]

  if (!event) {
    await sendChat({
      channel: CHANNEL_NAME,
      message: `Sorry @${username}. Your request could not be completed. Reason: !${command} is not initialized.`
    })
    return
  }

  const data = { ...payload, $command: [raw, command, argument] }
  await event(data)
}

export { chatCommand }
