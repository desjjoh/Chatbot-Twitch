import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

import { dehash } from '../utils/formatter.js'

const commands = {
  about: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { AUTHOR, USERNAME } = process.env
    const { username } = tags

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested !${command}. ${USERNAME} is a TwitchTV chat bot developed in NodeJS by twitch user ${AUTHOR} in 2023.`
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
        message: `Sorry @${username}. Your request could not be completed. [Reason] Current game could not be found.`
      })
      return
    }

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested !${command}. The current game is set to ${game}.`
    })
  }
}

export { commands }
