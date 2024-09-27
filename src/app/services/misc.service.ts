import { ChatUserstate } from 'tmi.js'
import { useNumberUtil } from '../../lib/utils/number.util.ts'

const NUMBER = useNumberUtil()

class MiscActions {
  public static async onBot(): Promise<string> {
    return `Hi, I'm @k38bot! I was developed by user https://twitch.tv/k3nata8 as a multi-purpose interactive stream assistant. If you're curious and want more information 
    you can find my source code @ https://github.com/k3na7a/TwitchBot.`
  }

  public static async onList(): Promise<string> {
    return `A full list of https://twitch.tv/k3nata8's game collection can be found @ https://tinyurl.com/ExtendedGameList.`
  }

  public static async onLurk({ userstate }: { userstate: ChatUserstate }): Promise<string> {
    return `@${userstate.username} is lurking in the shadows. Pay no attention.`
  }

  public static async onRoll({ userstate }: { userstate: ChatUserstate }): Promise<string> {
    const randNum = NUMBER.generateRandomNum(1, 20)
    return `@${userstate.username} rolled 1d20 and got ${randNum}.`
  }
}

export default MiscActions
