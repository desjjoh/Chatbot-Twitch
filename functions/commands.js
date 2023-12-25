import { sendChat } from '../plugins/tmi.js'
import { dehash, capitalize } from '../utils/formatter.js'

async function commands(payload) {
  const { tags, channel, $command } = payload
  const [, command] = $command
  const username = capitalize(tags.username)

  const LIST = [
    'about',
    'commands',
    'followage',
    'game',
    'tags',
    'title',
    'uptime'
  ]
    .map((key) => `!${key}`)
    .join(' ')

  await sendChat({
    channel: dehash(channel),
    message: `@${username} has requested the command !${command}. Here is a list of all available commands: ${LIST}`
  })
}

export { commands }
