import { ACTION_CMD } from '../../../lib/types/chat.ts'
import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter } from '../../../utils/formatters.ts'

const STRING = useStringFormatter()

async function onGame(payload: ACTION_CMD, _regExpMatchArray: RegExpMatchArray): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  return `The current stream category is set to: ${channel.gameName}.`
}

async function onSetGame(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const hasPermission = payload.userstate.badges?.broadcaster || payload.userstate.mod
  if (!hasPermission)
    throw new Error(`User ${payload.userstate.username} does not have permission to complete this action.`)

  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const game = await apiClient.games.getGameByName(argument.trim())
  if (!game) throw new Error(`Get game by name ${argument.trim()} has failed`)

  return apiClient.channels
    .updateChannelInfo(user.id, { gameId: game.id })
    .then(() => `The stream game has been updated to: ${game.name}.`)
}

export { onGame, onSetGame }
