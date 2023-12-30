import Bull from 'bull'

import { ChatbotPayloadType, ACTION_CMD } from '../../lib/types/chat.ts'
import { ChatbotActions, COMMANDS } from '../../lib/enums/chat.ts'

import { sendChat } from '../../services/chat/chat.ts'
import { onGame } from '../../services/chat/chat.actions.ts'

const regExpCommand: RegExp = new RegExp(/^!([a-zA-Z0-9]+)(?:\S+)?(.*)?/)

async function useActionCommandResolver(payload: ACTION_CMD): Promise<void> {
  const rexExpMatchArray: RegExpMatchArray | null = payload.message.match(regExpCommand)

  if (!rexExpMatchArray) return
  const [_raw, command, _argument] = rexExpMatchArray

  switch (command) {
    case COMMANDS.GAME:
      onGame(payload)
      break
    default:
  }
}

async function useChatbotResolver(job: Bull.Job<ChatbotPayloadType>, done: Bull.DoneCallback): Promise<void> {
  await new Promise<void>(async (resolve, _reject) => {
    switch (job.data.action) {
      case ChatbotActions.ACTION_CMD:
        await useActionCommandResolver(job.data)
        resolve()
      case ChatbotActions.SEND_MSG:
        await sendChat(job.data)
        resolve()
    }
  }).then(
    () => done,
    (err) => done(err)
  )
}

export { useActionCommandResolver, useChatbotResolver }
