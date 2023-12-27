import { sendChat } from '../plugins/tmi.js'
import { dehash, capitalize } from '../utils/formatter.js'

async function commands(payload) {
  const { tags, channel } = payload
  const username = capitalize(tags.username)

  const LIST = [
    '!about',
    '!commands',
    '!followage',
    '!game',
    '!tags',
    '!title',
    '!uptime'
  ].join(', ')

  await sendChat({
    channel: dehash(channel),
    message: `@${username}. Here is a list of all available commands: ${LIST}`
  })
}

export { commands }
