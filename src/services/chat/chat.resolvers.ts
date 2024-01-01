import Bull from 'bull'

import { ChatbotPayloadType, ACTION_CMD } from '../../lib/types/chat.ts'
import { ChatbotActions, COMMANDS } from '../../lib/enums/chat.ts'
import { regExpCommand } from '../../lib/constants/regex.ts'

import { sendChat } from '../../services/chat/chat.ts'

import * as QUOTES from './functions/quote.actions.ts'
import * as GAME from './functions/game.actions.ts'
import * as TITLE from './functions/title.actions.ts'
import * as MISC from './functions/misc.actions.ts'

import { logger } from '../../utils/logger.ts'
import { LoggerActions } from '../../lib/enums/logger.ts'

async function useActionCommandResolver(payload: ACTION_CMD): Promise<string> {
  const regExpMatchArray: RegExpMatchArray | null = payload.message.match(regExpCommand)
  if (!regExpMatchArray) throw new Error('Regular expression match failed.')

  const command = regExpMatchArray[1]

  switch (command) {
    case COMMANDS.GAME:
      return GAME.onGame(payload, regExpMatchArray)
    case COMMANDS.SETGAME:
      return GAME.onSetGame(payload, regExpMatchArray)
    case COMMANDS.SHOUTOUT:
      return MISC.onShoutout(payload, regExpMatchArray)
    case COMMANDS.UPTIME:
      return MISC.onUptime(payload, regExpMatchArray)
    case COMMANDS.TITLE:
      return TITLE.onTitle(payload, regExpMatchArray)
    case COMMANDS.SETTITLE:
      return TITLE.onSetTitle(payload, regExpMatchArray)
    case COMMANDS.ADDQUOTE:
      return QUOTES.onAddQuote(payload, regExpMatchArray)
    case COMMANDS.QUOTE:
      return QUOTES.onQuote(payload, regExpMatchArray)
    case COMMANDS.EDITQUOTE:
      return QUOTES.onEditQuote(payload, regExpMatchArray)
    case COMMANDS.REMOVEQUOTE:
      return QUOTES.onDeleteQuote(payload, regExpMatchArray)
    default:
      throw new Error(`No command named ${command} has been initialized.`)
  }
}

async function useChatbotResolver(job: Bull.Job<ChatbotPayloadType>, done: Bull.DoneCallback): Promise<void> {
  await new Promise<void>(async (resolve, reject) => {
    try {
      switch (job.data.action) {
        case ChatbotActions.ACTION_CMD:
          const result = await useActionCommandResolver(job.data)
          await sendChat({ channel: job.data.channel, message: result })
          logger.add({ action: LoggerActions.INFO, message: result })
          break
        case ChatbotActions.SEND_MSG:
          await sendChat(job.data)
          logger.add({ action: LoggerActions.INFO, message: job.data.message })
          break
      }
      resolve()
    } catch (err: unknown) {
      if (err instanceof Error) logger.add({ action: LoggerActions.ERROR, message: err.message })
      reject(err)
    }
  }).then(
    () => done(),
    (err) => done(err)
  )
}

export { useActionCommandResolver, useChatbotResolver }
