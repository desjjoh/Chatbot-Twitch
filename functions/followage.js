import { apiClient } from '../plugins/twurple.js'
import { sendChat } from '../plugins/tmi.js'
import { dehash, timeConversion, capitalize } from '../utils/formatter.js'
import moment from 'moment'

async function followage(payload) {
  const { tags, channel, $command } = payload
  const [, command] = $command
  const username = capitalize(tags.username)

  const USER = await apiClient.users.getUserByName(username)
  const BROADCASTER = await apiClient.users.getUserByName(dehash(channel))

  const CHANNELFOLLOWER = await BROADCASTER.getChannelFollower(USER.id)

  if (!CHANNELFOLLOWER?.followDate)
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] You do not follow the channel.`
    })
  else {
    const followDate = CHANNELFOLLOWER?.followDate
    const fDate = moment(followDate).format('llll')
    const followage = timeConversion(Date.now() - followDate.getTime())

    await sendChat({
      channel: dehash(channel),
      message: `@${username}. You have followed the stream since ${fDate} for a total of ${followage}`
    })
  }
}

export { followage }
