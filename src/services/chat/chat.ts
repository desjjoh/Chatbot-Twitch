import Bull from 'bull'

import { client } from '../../plugins/tmi.ts'

import { ChatbotPayloadType, ISendChat } from '../../lib/types/chat.ts'

import { useChatbotResolver } from '../../services/chat/chat.resolvers.ts'

const CONFIG: Bull.QueueOptions = { limiter: { max: 1, duration: 3000 } }
const chatbot: Bull.Queue<ChatbotPayloadType> = new Bull<ChatbotPayloadType>('chatbot', CONFIG)

async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message)
}

chatbot.process(useChatbotResolver)

export { chatbot, sendChat }
