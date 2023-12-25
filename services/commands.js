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
  followage: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, _argument] = $command
    const { username } = tags

    const USER = await apiClient.users.getUserByName(username)
    const BROADCASTER = await apiClient.users.getUserByName(dehash(channel))

    const CHANNELFOLLOWER = await BROADCASTER.getChannelFollower(USER.id)

    if (!CHANNELFOLLOWER?.followDate)
      await sendChat({
        channel: dehash(channel),
        message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] You do not follow the channel.`
      })
    else {
      const followDate = CHANNELFOLLOWER?.followDate
      const fDate = moment(followDate).format('llll')
      const followage = timeConversion(Date.now() - followDate.getTime())

      await sendChat({
        channel: dehash(channel),
        message: `@${username} has requested the command !${command}. You have followed the stream since ${fDate} for a total of ${followage}`
      })
    }
  },
  game: async (payload) => {
    const { tags, channel, $command } = payload
    const [_raw, command, argument] = $command
    const { username, mod } = tags

    const USER = await apiClient.users.getUserByName(dehash(channel))
    const isBroadcaster = Boolean(dehash(channel) == username)

    switch (argument) {
      case undefined:
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
        break
      default:
        if (mod || isBroadcaster) {
          const GAME = await apiClient.games.getGameByName(argument.trim())
          if (!GAME?.name)
            await sendChat({
              channel: dehash(channel),
              message: `Sorry @${username}. Your request !${command} ${argument.trim()} could not be completed. [Reason] Game [${argument.trim()}] could not be found.`
            })
          else
            await apiClient.channels
              .updateChannelInfo(USER.id, {
                gameId: GAME.id
              })
              .then(
                async (_res) => {
                  await sendChat({
                    channel: dehash(channel),
                    message: `@${username} has requested the command !${command} ${argument.trim()}. The stream game has been set to: ${argument.trim()}`
                  })
                },
                async (_err) => {
                  await sendChat({
                    channel: dehash(channel),
                    message: `Sorry @${username}. Your request !${command} ${argument.trim()} could not be completed. [Reason] Update channel info action could not be completed.`
                  })
                }
              )
        } else
          await sendChat({
            channel: dehash(channel),
            message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] You do not have permission to complete this action.`
          })
    }
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
    const [_raw, command, argument] = $command
    const { username, mod } = tags

    const USER = await apiClient.users.getUserByName(dehash(channel))
    const CHANNEL = await apiClient.channels.getChannelInfoById(USER?.id)

    const isBroadcaster = Boolean(dehash(channel) == username)

    switch (argument) {
      case undefined:
        if (!CHANNEL?.title)
          await sendChat({
            channel: dehash(channel),
            message: `Sorry @${username}. Your !${command} request could not be completed. [Reason] Stream title could not be found.`
          })
        else
          await sendChat({
            channel: dehash(channel),
            message: `@${username} has requested the command !${command}. The stream title is: ${CHANNEL?.title}`
          })
        break
      default:
        if (mod || isBroadcaster)
          await apiClient.channels
            .updateChannelInfo(USER.id, {
              title: argument.trim()
            })
            .then(
              async (_res) => {
                await sendChat({
                  channel: dehash(channel),
                  message: `@${username} has requested the command !${command} ${argument.trim()}. The stream title has been set to: ${argument.trim()}`
                })
              },
              async (_err) => {
                await sendChat({
                  channel: dehash(channel),
                  message: `Sorry @${username}. Your request !${command} ${argument.trim()} could not be completed. [Reason] Update channel info action could not be completed.`
                })
              }
            )
        else {
          await sendChat({
            channel: dehash(channel),
            message: `Sorry @${username}. Your request !${command} ${argument} could not be completed. [Reason] You do not have permission to complete this action.`
          })
        }
    }
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

  const regExpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\S+)?(.*)?/)
  const [raw, command, argument] = message.match(regExpCommand)

  const $message = `info: [${channel}] <${username}>: ${message}`
  logger.add({ $message })

  const event = commands[command]

  if (!event)
    await sendChat({
      channel: dehash(channel),
      message: `Sorry @${username}. Your request could not be completed. [Reason] Command !${command} has not been initialized.`
    })
  else await event({ ...payload, $command: [raw, command, argument] })
}

export { chatCommand, commands }
