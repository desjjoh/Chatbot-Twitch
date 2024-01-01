import { ACTION_CMD } from '../../../lib/types/chat.ts'
import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter, useDateTimeFormatter } from '../../../utils/formatters.ts'

const STRING = useStringFormatter()
const DATETIME = useDateTimeFormatter()

async function onUptime(payload: ACTION_CMD, _regExpMatchArray: RegExpMatchArray): Promise<string> {
  const stream = await apiClient.streams.getStreamByUserName(STRING.dehash(payload.channel))
  if (!stream) throw new Error(`Get stream by username ${payload.channel} has failed`)

  const uptime = DATETIME.formatMilliseconds(Date.now() - stream.startDate.getTime())
  return `The stream has been live for ${uptime}.`
}

async function onShoutout(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const hasPermission = payload.userstate.badges?.broadcaster || payload.userstate.mod
  if (!hasPermission)
    throw new Error(`User ${payload.userstate.username} does not have permission to complete this action.`)

  const user = await apiClient.users.getUserByName(argument.trim())
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user id ${user.id} has failed.`)

  return channel.gameName
    ? `Check out @${user.name} over at twitch.tv/${user.name}! They were last seen playing ${channel.gameName}.`
    : `Check out @${user.name} over at twitch.tv/${user.name}!`
}

export { onUptime, onShoutout }
