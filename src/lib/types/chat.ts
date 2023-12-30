import { ChatUserstate } from 'tmi.js'

import { ChatbotActions } from '../enums/chat.ts'

type ACTION_CMD = {
  action: ChatbotActions.ACTION_CMD
  channel: string
  message: string
  userstate: ChatUserstate
}

type SEND_MSG = {
  action: ChatbotActions.SEND_MSG
  channel: string
  message: string
}

type ISendChat = {
  channel: string
  message: string
}

type ChatbotPayloadType = SEND_MSG | ACTION_CMD

export { ACTION_CMD, SEND_MSG, ISendChat, ChatbotPayloadType }
