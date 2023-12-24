import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'

import { dehash } from './formatter.js'

const commands = {
  game: async (payload) => {
    const { tags, channel, $command } = payload
    const { username } = tags

    const [raw, command, argument] = $command

    const STREAM = await apiClient.streams.getStreamByUserName(dehash(channel))
    const game = STREAM?.gameName

    if (!game) {
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your request could not be completed. [Reason]: Current game could not be found.`
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
