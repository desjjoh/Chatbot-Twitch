import apiClient from '../../plugins/twurple.ts'

import { ACTION_CMD } from '../../lib/types/chat.ts'

import { useStringFormatter } from '../../utils/formatters.ts'

const STRING = useStringFormatter()

async function onGame(payload: ACTION_CMD): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error('Get user by channel name failed')

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error('Get channel info by user ID failed')

  return `The current stream category is set to ${channel.gameName}`
}

async function onTitle(payload: ACTION_CMD): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error('Get user by channel name failed')

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error('Get channel info by user ID failed')

  return `The current stream title is set to ${channel.title}`
}

async function onSetGame(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error('Get user by channel name failed')

  return apiClient.channels
    .updateChannelInfo(user.id, { title: argument.trim() })
    .then(() => `The stream title has been set to ${argument.trim()}`)
}

export { onGame, onTitle, onSetGame }
