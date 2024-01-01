import moment from 'moment'

import apiClient from '../../plugins/twurple.ts'

import { ACTION_CMD } from '../../lib/types/chat.ts'

import { useDateTimeFormatter, useStringFormatter } from '../../utils/formatters.ts'

import DatabaseService from '../database/database.ts'

const STRING = useStringFormatter()
const DATETIME = useDateTimeFormatter()

async function onAddQuote(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  const { gameId, gameName } = channel
  if (!gameId || !gameName) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  const quote = await DatabaseService.Quote.createQuote({
    gameId,
    gameName,
    quote: argument.trim()
  })

  return `Quote #${quote.$id} has been successfully added!`
}

async function onQuote(_payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  if (argument) {
    const quoteId = parseInt(argument)
    if (isNaN(quoteId)) throw new Error(`Argument ${argument.trim()} could not be parsed into an integer.`)

    const quote = await DatabaseService.Quote.getQuote(quoteId)
    if (!quote) throw new Error(`Quote with id ${quoteId} could not be found`)

    return `Quote #${quote.$id}: ${moment(quote.$createdAt).format('l')} "${quote.quote}" [${quote.gameName}]`
  }

  const randomQuote = await DatabaseService.Quote.getRandomQuote()
  return `Quote #${randomQuote.$id}: ${moment(randomQuote?.$createdAt).format('l')} "${randomQuote?.quote}" [${
    randomQuote?.gameName
  }]`
}

//#region @Getters
async function onGame(payload: ACTION_CMD, _regExpMatchArray: RegExpMatchArray): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  return `The current stream category is set to: ${channel.gameName}.`
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

async function onTitle(payload: ACTION_CMD, _regExpMatchArray: RegExpMatchArray): Promise<string> {
  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  const channel = await apiClient.channels.getChannelInfoById(user.id)
  if (!channel) throw new Error(`Get channel info by user ID ${user.id} has failed.`)

  return `The current stream title is set to: ${channel.title}.`
}

async function onUptime(payload: ACTION_CMD, _regExpMatchArray: RegExpMatchArray): Promise<string> {
  const stream = await apiClient.streams.getStreamByUserName(STRING.dehash(payload.channel))
  if (!stream) throw new Error(`Get stream by username ${payload.channel} has failed`)

  const uptime = DATETIME.formatMilliseconds(Date.now() - stream.startDate.getTime())
  return `The stream has been live for ${uptime}.`
}
//#endregion

//#region @setters
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

async function onSetTitle(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const hasPermission = payload.userstate.badges?.broadcaster || payload.userstate.mod
  if (!hasPermission)
    throw new Error(`User ${payload.userstate.username} does not have permission to complete this action.`)

  const user = await apiClient.users.getUserByName(STRING.dehash(payload.channel))
  if (!user) throw new Error(`Get user by name ${payload.channel} has failed.`)

  return apiClient.channels
    .updateChannelInfo(user.id, { title: argument.trim() })
    .then(() => `The stream title has been updated to: ${argument.trim()}.`)
}
//#endregion

export { onGame, onQuote, onShoutout, onTitle, onUptime, onAddQuote, onSetGame, onSetTitle }
