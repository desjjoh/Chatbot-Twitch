import Bull from 'bull'

import { ChatbotPayloadType, ACTION_CMD } from '../../lib/types/chat.ts'
import { ChatbotActions, COMMANDS } from '../../lib/enums/chat.ts'
import { regExpCommand } from '../../lib/constants/regex.ts'

import { sendChat } from '../../services/chat/chat.ts'
import * as ACTIONS from '../../services/chat/chat.actions.ts'
import { logger } from '../../utils/logger.ts'
import { LoggerActions } from '../../lib/enums/logger.ts'

async function useActionCommandResolver(payload: ACTION_CMD): Promise<string> {
  const regExpMatchArray: RegExpMatchArray | null = payload.message.match(regExpCommand)
  if (!regExpMatchArray) throw new Error('REGULAR EXPRESSION MATCH FAILED')
  const command = regExpMatchArray[1]

  switch (command) {
    case COMMANDS.GAME:
      return ACTIONS.onGame(payload)
    case COMMANDS.TITLE:
      return ACTIONS.onTitle(payload)
    case COMMANDS.SETGAME:
      return ACTIONS.onSetGame(payload, regExpMatchArray)
    default:
      throw new Error(`COMMAND ${command} NOT INITIALIZED`)
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
