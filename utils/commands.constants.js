import { apiClient } from '../plugins/twurple.js'

const commands = {
  game: async (payload) => {
    const { tags, $command, channel } = payload
    const [raw, command, argument] = $command
    const { username } = tags

    const { CHANNEL_NAME } = process.env

    const STREAM = await apiClient.streams.getStreamByUserName(CHANNEL_NAME)
    const game = STREAM?.gameName

    if (!game) {
      await sendChat({
        channel: CHANNEL_NAME,
        message: ''
      })
    }

    await sendChat({
      channel: CHANNEL_NAME,
      message: `Hey @${username}.`
    })
  }
}

export { commands }
