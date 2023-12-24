import { apiClient } from '../plugins/twurple.js'

const commands = {
  GAME: {
    command: 'game',
    event: async (payload) => {
      const { tags, $command, channel } = payload
      const { CHANNEL_NAME } = process.env
      const { username } = tags

      const [raw, command, argument] = $command

      //   const USER = await apiClient.users.getUserByName(channel)
      const STREAM = await apiClient.streams.getStreamByUserName(channel)
      //   const CHANNEL = await apiClient.channels.getChannelInfoById(USER.id)

      await sendChat({ channel: CHANNEL_NAME, message: undefined })
    }
  }
}

export { commands }
