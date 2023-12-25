import { apiClient } from '../plugins/twurple.js'
import { dehash, timeConversion, capitalize } from '../utils/formatter.js'
import { sendChat } from '../plugins/tmi.js'

import moment from 'moment'

async function uptime(payload) {
  const { tags, channel, $command } = payload
  const [, command] = $command
  const username = capitalize(tags.username)

  const STREAM = await apiClient.streams.getStreamByUserName(dehash(channel))

  if (!STREAM.startDate)
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream start date could not be found.`
    })
  else {
    const startDate = moment(STREAM?.startDate).format('llll')
    const uptime = timeConversion(Date.now() - STREAM?.startDate.getTime())
    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested the command !${command}. The stream has been live since ${startDate} for a total of ${uptime}`
    })
  }
}

export { uptime }
