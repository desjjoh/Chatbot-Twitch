import Bull from 'bull'

const chatbotQueue = new Bull('chatbot-queue', {
  redis: { host: '127.0.0.1', port: 6379 },
  limit: { max: 1 }
})

const actions = {
  GAME: 'game',
  FOLLOWAGE: 'followage'
}

chatbotQueue.process(async (payload, done) => {
  try {
    const { channel, tags, message, self } = payload.data
    const args = message.slice(1).split(' ')

    const key = args.shift().toLowerCase()
    const value = args.join(' ')

    const { username } = tags

    switch (key) {
      case actions.GAME:
        break
      case actions.FOLLOWAGE:
        
        break
      default:
        break
    }
    done()
  } catch (err) {
    done(err)
  }
})

export { chatbotQueue }
