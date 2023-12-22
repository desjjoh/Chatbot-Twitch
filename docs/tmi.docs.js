// Install using npm
// npm i tmi.js

// Anonymous connection
// An anonymous connection allows you to connect to Twitch without having to authenticate. This is ideal for chat overlays.

const tmi = require('tmi.js')
const client = new tmi.Client({
  channels: ['my_name']
})

client.connect()

client.on('message', (channel, tags, message, self) => {
  console.log(`${tags['display-name']}: ${message}`)
})

// OAuth token authorization
// Using authorization allows the bot to send messages on behalf of the authenticated account. Typically this would be a dedicated bot account, but it could be an interface for a user to send messages directly.

const tmi = require('tmi.js')

const client2 = new tmi.Client({
  options: { debug: true },
  identity: {
    username: 'my_bot_name',
    password: 'oauth:my_bot_token' //https://twitchapps.com/tmi
  },
  channels: ['my_name']
})

client2.connect()

// Simple command handler
// This command handler example will split a message like this example chat message: !Echo Chat message here into the command "echo" with the arguments [ "Chat", "message", "here" ].

client2.on('message', (channel, tags, message, self) => {
  if (self || !message.startsWith('!')) return

  const args = message.slice(1).split(' ')
  const command = args.shift().toLowerCase()

  if (command === 'echo') {
    client.say(channel, `@${tags.username}, you said: "${args.join(' ')}"`)
  }
})

// Regular
client.say(channel, message)
// Action
client.action(channel, message)

// # IN PROGRESS ACTION COMMAND RESOLVER
function commandAction(channel, tags, message, self) {
  const args = message.slice(1).split(' ')

  const key = args.shift().toLowerCase()
  const value = args.join(' ')

  switch (key) {
    case 'test':
      CLIENT.say(channel, `@${tags.username}, you said: "${value}"`)
      break
  }
}

// # Interval Messages
clientTWI.on('connected', (address, port) => {
  clientTWI.action('Redfur_13', 'SweetyBot has awoken from her slumber')
  setInterval(() => {
    messageInterval()
  }, 1000)
})

function messageInterval() {
  clientTWI.say(' Here is the message')
}
