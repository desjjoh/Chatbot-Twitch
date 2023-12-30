import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

import { dehash, capitalize } from '../utils/formatter.js'

async function title(payload) {
  const { tags, channel, $command } = payload
  const [, command, argument] = $command
  const { mod } = tags
  const username = capitalize(tags.username)

  const USER = await apiClient.users.getUserByName(dehash(channel))
  const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

  const isBroadcaster = capitalize(dehash(channel)) == username

  switch (argument) {
    case undefined:
      if (!CHANNEL?.title)
        await sendChat({
          channel: dehash(channel),
          message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream title could not be found.`
        })
      else
        await sendChat({
          channel: dehash(channel),
          message: `@${username}. The stream title is: ${CHANNEL?.title}`
        })
      break
    default:
      if (mod || isBroadcaster)
        await apiClient.channels
          .updateChannelInfo(USER.id, {
            title: argument
          })
          .then(
            async () => {
              await sendChat({
                channel: dehash(channel),
                message: `@${username}. The stream title has been set to: ${argument}`
              })
            },
            async () => {
              await sendChat({
                channel: dehash(channel),
                message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] Update channel info action could not be completed.`
              })
            }
          )
      else {
        await sendChat({
          channel: dehash(channel),
          message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] You do not have permission to complete this action.`
        })
      }
  }
}

export { title }
