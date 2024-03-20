import Bull from 'bull'

import { ChatbotPayloadType, ISendChat } from '../../lib/types/chat.types.ts'

import { useChatbotResolver } from '../resolvers/chatbot.resolver.ts'

import client from '../../plugins/tmi.plugin.ts'

const CONFIG: Bull.QueueOptions = { limiter: { max: 1, duration: 3000 } }
const chatbot: Bull.Queue<ChatbotPayloadType> = new Bull<ChatbotPayloadType>('chatbot', CONFIG)

async function sendChat({ channel, message }: ISendChat): Promise<[string]> {
  return client.say(channel, message)
}

await chatbot.empty()
chatbot.process(useChatbotResolver)

export default chatbot
export { sendChat }
