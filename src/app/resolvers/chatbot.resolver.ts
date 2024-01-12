import Bull from 'bull'

import { ChatbotPayloadType } from '../../lib/types/chat.types.ts'
import { ChatbotActions } from '../../lib/enums/chat.enums.ts'
import { LoggerActions } from '../../lib/enums/logger.enums.ts'


import { logger } from '../queues/logger.queue.ts'

import { useActionCommandResolver } from './actions.resolver.ts'
import { sendChat } from '../queues/chat.queue.ts'

async function useChatbotResolver(job: Bull.Job<ChatbotPayloadType>, done: Bull.DoneCallback): Promise<void> {
  await new Promise<void>(async (resolve, reject) => {
    try {
      switch (job.data.action) {
        case ChatbotActions.ACTION_CMD:
          const ACTION_CMD_RESULT = await useActionCommandResolver(job.data)
          await sendChat({ channel: job.data.channel, message: ACTION_CMD_RESULT })
          logger.add({ action: LoggerActions.INFO, message: ACTION_CMD_RESULT })
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
