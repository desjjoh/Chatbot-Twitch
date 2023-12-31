import {
  BanUserstate,
  ChatUserstate,
  DeleteUserstate,
  SubGiftUserstate,
  SubMethods,
  SubMysteryGiftUserstate,
  SubUserstate,
  TimeoutUserstate
} from 'tmi.js'

import { logger } from '../../utils/logger.ts'
import { useStringFormatter } from '../../utils/formatters.ts'

import { LoggerActions } from '../../lib/enums/logger.ts'
import { ChatbotActions } from '../../lib/enums/chat.ts'

import { chatbot } from '../../services/chat/chat.ts'

const STRING = useStringFormatter()

function onConnecting(address: string, port: number): void {
  const message = `Connecting to ${address} on port ${port}..`
  logger.add({ action: LoggerActions.INFO, message })
}

function onLogon(): void {
  const message = `Sending authentication to server..`
  logger.add({ action: LoggerActions.INFO, message })
}

function onConnected(_address: string, _port: number): void {
  const message = `Connected to server.`
  logger.add({ action: LoggerActions.INFO, message })
}

function onJoin(channel: string, username: string, self: boolean): void {
  if (!self) return

  const message = `Joined ${channel}`

  logger.add({ action: LoggerActions.INFO, message })
  chatbot.add({
    action: ChatbotActions.SEND_MSG,
    channel,
    message: `Hi I'm ${username}! How may I help you today?`
  })
}

function onDisconnected(reason: string): void {
  const message = `Disconnected from server. Reason: ${reason}`
  logger.add({ action: LoggerActions.ERROR, message })
}

function onReconnect(): void {
  const message = 'Reconnected to server.'
  logger.add({ action: LoggerActions.INFO, message })
}

function onMessage(channel: string, userstate: ChatUserstate, message: string, self: boolean): void {
  if (self || !message.startsWith('!')) return

  logger.add({ action: LoggerActions.INFO, message: `[@${userstate.username}] ${message}` })
  chatbot.add({ action: ChatbotActions.ACTION_CMD, channel, message, userstate })
}

function onRaided(channel: string, username: string, viewers: number): void {
  const message = `${username} has raided the channel with ${viewers} ${STRING.pluralize({
    value: viewers,
    word: 'viewer'
  })}`

  logger.add({ action: LoggerActions.INFO, message })
  chatbot.add({ action: ChatbotActions.SEND_MSG, channel, message })
}

// TODO : Actually write code for these functions
function onRedeem(_channel: string, _username: string, _rewardType: string, _userstate: ChatUserstate): void {}
function onBan(_channel: string, _username: string, _reason: string, _userstate: BanUserstate): void {}
function onTimeout(
  _channel: string,
  _username: string,
  _reason: string,
  _duration: number,
  _userstate: TimeoutUserstate
): void {}
function onSubscription(
  _channel: string,
  _username: string,
  _methods: SubMethods,
  _message: string,
  _userstate: SubUserstate
): void {}
function onReSub(
  _channel: string,
  _username: string,
  _months: number,
  _message: string,
  _userstate: SubUserstate,
  _methods: SubMethods
): void {}
function onMessageDeleted(
  _channel: string,
  _username: string,
  _deletedMessage: string,
  _userstate: DeleteUserstate
): void {}
function onSubGift(
  _channel: string,
  _username: string,
  _streakMonths: number,
  _recipient: string,
  _methods: SubMethods,
  _userstate: SubGiftUserstate
): void {}
function onSubMysteryGift(
  _channel: string,
  _username: string,
  _numbOfSubs: number,
  _methods: SubMethods,
  _userstate: SubMysteryGiftUserstate
): void {}

export {
  onConnecting,
  onLogon,
  onConnected,
  onJoin,
  onDisconnected,
  onReconnect,
  onMessage,
  onRaided,
  onRedeem,
  onBan,
  onTimeout,
  onSubscription,
  onReSub,
  onMessageDeleted,
  onSubGift,
  onSubMysteryGift
}
