import Bull from 'bull'

import { sendChat } from '../plugins/tmi.js'
import { chatCommand } from '../utils/commands.js'
import { loggerQueue } from './logger.js'


const chatbotQueue = new Bull('chatbot-queue', {
  redis: { host: '127.0.0.1', port: 6379 },
  limit: { max: 1 }
})

const actions = {
  CHAT_COMMAND: 'chat_command',
  SEND_CHAT: 'send_chat'
}

chatbotQueue.on('completed', function (job) {
  const $message = `info: [QUEUE] <ChatBot> Job with id ${job.id} has been completed`
  loggerQueue.add({ $message })
})

chatbotQueue.process(async (payload, done) => {
  try {
    const { action } = payload.data

    switch (action) {
      case actions.CHAT_COMMAND:
        await chatCommand(payload.data)
        break
      case actions.SEND_CHAT:
        await sendChat(payload.data)
        break
      default:
    }

    done()
  } catch (err) {
    done(err)
  }
})

export { chatbotQueue, actions }
