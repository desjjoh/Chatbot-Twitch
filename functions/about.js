/* eslint-disable no-undef */
import { dehash, capitalize } from '../utils/formatter.js'

const { AUTHOR, TTV_USERNAME, GITHUB } = process.env

async function about(payload) {
  const { tags, channel, $command } = payload
  const [, command] = $command
  const username = capitalize(tags.username)

  await sendChat({
    channel: dehash(channel),
    message: `@${username} has requested the command !${command}. I'm @${TTV_USERNAME}, a TwitchTV chat bot developed in NodeJS by twitch user @${AUTHOR} in December of 2023. 
      My source code can be found @ ${GITHUB}`
  })
}

export { about }
