import Bull from 'bull'

import { chatCommand, sendChat } from '../utils/commands.js'

const chatbotQueue = new Bull('chatbot-queue', {
  redis: { host: '127.0.0.1', port: 6379 },
  limit: { max: 1 }
})

const actions = {
  CHAT_COMMAND: 'chat_command',
  SEND_CHAT: 'send_chat'
}

chatbotQueue.process(async (payload, done) => {
  try {
    const { action } = payload.data

    switch (action) {
      case actions.CHAT_COMMAND:
        await chatCommand(payload)
        break
      case actions.SEND_CHAT:
        await sendChat(payload)
        break
      default:
    }

    done()
  } catch (err) {
    done(err)
  }
})

export { chatbotQueue, actions }
