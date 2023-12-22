import { chatClient } from '../plugins/tmi.js'

async function chatCommand(payload) {
  const { channel, tags, message, self } = payload.data
  const { username } = tags

  const args = message.slice(1).split(' ')
  const key = args.shift().toLowerCase()
  const value = args.join(' ')

  console.log(key, value)
}

async function sendChat(payload) {
  const { channel, message } = payload.data
  await chatClient.say(channel, message)
}

export { chatCommand, sendChat }
