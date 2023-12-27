import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'
import { dehash, capitalize } from '../utils/formatter.js'

async function game(payload) {
  const { tags, channel, $command } = payload
  const [, command, argument] = $command
  const { mod } = tags
  const username = capitalize(tags.username)

  const USER = await apiClient.users.getUserByName(dehash(channel))
  const isBroadcaster = capitalize(dehash(channel)) == username

  const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)
  const game = CHANNEL?.gameName

  switch (argument) {
    case undefined:
      if (!game)
        await sendChat({
          channel: dehash(channel),
          message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Current game could not be found.`
        })
      else
        await sendChat({
          channel: dehash(channel),
          message: `@${username}. The current game is [${game}].`
        })
      break
    default:
      if (mod || isBroadcaster) {
        const GAME = await apiClient.games.getGameByName(argument)
        if (!GAME?.name)
          await sendChat({
            channel: dehash(channel),
            message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] Game [${argument}] could not be found.`
          })
        else
          await apiClient.channels
            .updateChannelInfo(USER.id, {
              gameId: GAME.id
            })
            .then(
              async () => {
                await sendChat({
                  channel: dehash(channel),
                  message: `@${username}. The stream game has been set to [${argument}]`
                })
              },
              async () => {
                await sendChat({
                  channel: dehash(channel),
                  message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] Update channel info action could not be completed.`
                })
              }
            )
      } else
        await sendChat({
          channel: dehash(channel),
          message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] You do not have permission to complete this action.`
        })
  }
}

export { game }
