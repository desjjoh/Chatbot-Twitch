import { ChatUserstate } from 'tmi.js'
import { useNumberUtil } from '../../utils/number.util.ts'

const NUMBER = useNumberUtil()

async function onBot(): Promise<string> {
  return `Hi, I'm k38bot! I was developed by user https://twitch.tv/k3nata8 as a multi-purpose interactive stream assistant. If you're curious and want more information 
  you can find my source code @ https://github.com/k3na7a/TwitchBot.`
}

async function onList(): Promise<string> {
  return `A full list of https://twitch.tv/k3nata8's game collection can be found @ https://tinyurl.com/ExtendedGameList.`
}

async function onRoll({ userstate }: { userstate: ChatUserstate }): Promise<string> {
  const randNum = NUMBER.generateRandomNum(1, 20)
  return `@${userstate.username} rolled 1d20 and got ${randNum}.`
}

export { onBot, onList, onRoll }
