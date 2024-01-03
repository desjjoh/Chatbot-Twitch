import Bull from 'bull'

import { ChatbotPayloadType } from '../../../lib/types/chat.ts'
import { ChatbotActions } from '../../../lib/enums/chat.ts'
import { LoggerActions } from '../../../lib/enums/logger.ts'

import { sendChat } from '../../../services/chat/chat.ts'

import { logger } from '../../../utils/logger.ts'

import { useActionCommandResolver } from './actions.resolver.ts'

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

export { useChatbotResolver }
