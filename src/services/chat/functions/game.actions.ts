import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter } from '../../../utils/formatters.ts'

const STRING = useStringFormatter()

async function onGame(payload: { channel: string }): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  return `The current stream category is set to: ${channel.gameName}.`
}

async function onSetGame(payload: { channel: string; argument: string }): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const game = await apiClient.games.getGameByName(payload.argument.trim())
  if (!game) throw new Error(`Get game by name ${payload.argument.trim()} has failed`)

  return apiClient.channels
    .updateChannelInfo(user.id, { gameId: game.id })
    .then(() => `The stream game has been updated to: ${game.name}.`)
}

export { onGame, onSetGame }
