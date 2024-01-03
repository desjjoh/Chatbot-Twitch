import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter, useDateTimeFormatter } from '../../../utils/formatters.ts'

const STRING = useStringFormatter()
const DATETIME = useDateTimeFormatter()

async function onAbout(): Promise<string> {
  return `Hi, I'm k38bot! I was developed by twitch.tv/k3nata8 as a multi-purpose stream assistant. You can find my source code @ `
}

async function onUptime(payload: { channel: string }): Promise<string> {
  const stream = await apiClient.streams.getStreamByUserName(STRING.dehash(payload.channel))
  if (!stream) throw new Error(`Get stream by username ${payload.channel} has failed`)

  const uptime = DATETIME.formatMilliseconds(Date.now() - stream.startDate.getTime())
  return `The stream has been live for ${uptime}.`
}

async function onShoutout(payload: { channel: string; argument: string }): Promise<string> {
  const user = await apiClient.users.getUserByName(payload.argument.trim())
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user id ${user.id} has failed.`)

  return channel.gameName
    ? `Check out @${user.name} over at twitch.tv/${user.name}! They were last seen playing ${channel.gameName}.`
    : `Check out @${user.name} over at twitch.tv/${user.name}!`
}

export { onAbout, onUptime, onShoutout }
