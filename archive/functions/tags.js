import { dehash, capitalize } from '../utils/formatter.js'
import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

async function tags(payload) {
  const { tags, channel, $command } = payload
  const [, command] = $command
  const username = capitalize(tags.username)

  const USER = await apiClient.users.getUserByName(dehash(channel))
  const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

  if (!CHANNEL?.tags)
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream tags could not be found.`
    })
  else
    await sendChat({
      channel: dehash(channel),
      message: `@${username}. The stream tags are ${CHANNEL?.tags
        .map((tag) => `[${tag}]`)
        .join(', ')}.`
    })
}

export { tags }
