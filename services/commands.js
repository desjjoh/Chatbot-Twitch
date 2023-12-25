import moment from 'moment'

import { logger } from '../queues/logger.js'
import { sendChat } from '../plugins/tmi.js'
import { apiClient } from '../plugins/twurple.js'
import { dehash, timeConversion } from '../utils/formatter.js'

const { AUTHOR, TTV_USERNAME, GITHUB } = process.env
const commands = {
  about: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested the command !${command}. I'm @${TTV_USERNAME}, a TwitchTV chat bot developed in NodeJS by twitch user @${AUTHOR} in December of 2023. 
      My source code can be found @ ${GITHUB}`
    })
  },
  commands: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const LIST = Object.keys(commands)
      .map((key) => `!${key}`)
      .join(' ')

    await sendChat({
      channel: dehash(channel),
      message: `@${username} has requested the command !${command}. Here is a list of all available commands: ${LIST}`
    })
  },
  game: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, argument] = $command
    const { username } = tags

    const USER = await apiClient.users.getUserByName(dehash(channel))
    const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

    const game = CHANNEL?.gameName
    if (!game)
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Current game could not be found.`
      })
    else
      await sendChat({
        channel: dehash(channel),
        message: `@${username} has requested the command !${command}. The current game is [${game}].`
      })
  },
  tags: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const USER = await apiClient.users.getUserByName(dehash(channel))
    const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

    if (!CHANNEL?.tags)
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream tags could not be found.`
      })
    else
      await sendChat({
        channel: dehash(channel),
        message: `@${username} has requested the command !${command}. The stream tags are ${CHANNEL?.tags
          .map((tag) => `[${tag}]`)
          .join(', ')}.`
      })
  },
  title: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const USER = await apiClient.users.getUserByName(dehash(channel))
    const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

    if (!CHANNEL?.title)
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream title could not be found.`
      })
    else
      await sendChat({
        channel: dehash(channel),
        message: `@${username} has requested the command !${command}. The stream title is ${CHANNEL?.title}`
      })
  },
  uptime: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const STREAM = await apiClient.streams.getStreamByUserName(dehash(channel))

    if (!STREAM.startDate)
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream start date could not be found.`
      })
    else {
      const startDate = moment(STREAM?.startDate).format('llll')
      const uptime = timeConversion(Date.now() - STREAM?.startDate.getTime())
      await sendChat({
        channel: dehash(channel),
        message: `@${username} has requested the command !${command}. The stream has been live since ${startDate} for a total of ${uptime}`
      })
    }
  }
}

async function chatCommand(payload) {
  const { message, tags, channel } = payload
  const { username } = tags

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  const event = commands[command]

  if (!event) {
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your request could not be completed. [Reason] Command !${command} has not been initialized.`
    })
    return
  }

  const data = { ...payload, $command: [raw, command, argument] }
  await event(data)
}

export { chatCommand, commands }
