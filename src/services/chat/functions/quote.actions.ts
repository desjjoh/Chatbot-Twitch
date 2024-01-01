import moment from 'moment'
import { ACTION_CMD } from '../../../lib/types/chat.ts'
import apiClient from '../../../plugins/twurple.ts'
import { useStringFormatter } from '../../../utils/formatters.ts'
import DatabaseService from '../../database/database.ts'
import { regExpIDExtract } from '../../../lib/constants/regex.ts'

const STRING = useStringFormatter()

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

async function onEditQuote(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const hasPermission = payload.userstate.badges?.broadcaster || payload.userstate.mod
  if (!hasPermission)
    throw new Error(`User ${payload.userstate.username} does not have permission to complete this action.`)

  const regExp: RegExpMatchArray | null = argument.trim().match(regExpIDExtract)
  if (!regExp) throw new Error('Regular expression match failed.')

  const [_match, id, edit] = regExp

  const $id = parseInt(id)
  if (isNaN($id)) throw new Error(`Could not parse ${id} into an integer.`)

  const quote = await DatabaseService.Quote.editQuote({ id: $id, quote: edit })
  return `Quote #${quote?.$id} has been successfully updated.`
}

async function onDeleteQuote(payload: ACTION_CMD, regExpMatchArray: RegExpMatchArray): Promise<string> {
  const [_raw, _command, argument] = regExpMatchArray

  const hasPermission = payload.userstate.badges?.broadcaster || payload.userstate.mod
  if (!hasPermission)
    throw new Error(`User ${payload.userstate.username} does not have permission to complete this action.`)

  const id = parseInt(argument.trim())
  if (isNaN(id)) throw new Error(`Could not parse arguement ${argument.trim()} into an integer.`)

  await DatabaseService.Quote.deleteQuote(id)
  return `Quote #${id} has been successfully removed.`
}

export { onQuote, onAddQuote, onEditQuote, onDeleteQuote }
