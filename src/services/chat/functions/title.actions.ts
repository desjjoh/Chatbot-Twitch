import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter } from '../../../utils/formatters.ts'

const STRING = useStringFormatter()

async function onTitle(payload: { channel: string }): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  return `The current stream title is set to: ${channel.title}.`
}

async function onSetTitle(payload: { channel: string; argument: string }): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  return apiClient.channels
    .updateChannelInfo(user.id, { title: payload.argument.trim() })
    .then(() => `The stream title has been updated to: ${payload.argument.trim()}.`)
}

export { onTitle, onSetTitle }
