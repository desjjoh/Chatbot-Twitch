import { logger } from '../services/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { commands } from './commands.constants.js'

async function chatCommand(payload) {
  const { message, channel, tags } = payload
  const { username } = tags

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const data = { ...payload, $command: [raw, command, argument] }

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  switch (command) {
    case commands.GAME.command:
      await commands.GAME.event(data)
      break
    default:
      await sendChat(
        channel,
        `Sorry @${username}. Your !${command} request could not be completed. Reason: !${command} is not initialized.`
      )
  }
}

export { chatCommand }
