import { apiClient } from '../plugins/twurple.js'
import { DatabaseService } from '../services/database.js'

import { dehash } from './formatter.js'

const commands = {
  GAME: {
    command: 'game',
    event: async (payload) => {
      const { tags, $command, channel } = payload
      const { username } = tags

      const [raw, command, argument] = $command

      //   const USER = await apiClient.users.getUserByName(channel)
      //   const STREAM = await apiClient.streams.getStreamByUserName(dehash(channel))
      //   const CHANNEL = await apiClient.channels.getChannelInfoById(USER.id)

      const message = `Hey @${username}. `
      await sendChat({ channel: CHANNEL_NAME, message })
    }
  }
}

export { commands }
