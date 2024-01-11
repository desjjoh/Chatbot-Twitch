import { ChatUserstate } from 'tmi.js'

import { ACTION_CMD } from '../../../lib/types/chat.ts'
import { COMMANDS } from '../../../lib/enums/chat.ts'
import { regExpCommand } from '../../../lib/constants/regex.ts'

import * as QUOTES from '../functions/quote.actions.ts'
import * as CHANNEL from '../functions/channel.actions.ts'
import * as MISC from '../functions/misc.actions.ts'

async function hasPermission(userstate: ChatUserstate): Promise<void> {
  const authorized = userstate.badges?.broadcaster || userstate.mod
  if (!authorized) throw new Error(`User ${userstate.username} does not have permission to complete this action.`)
}

async function useActionCommandResolver({ channel, userstate, message }: ACTION_CMD): Promise<string> {
  const regExpMatchArray: RegExpMatchArray | null = message.match(regExpCommand)
  if (!regExpMatchArray) throw new Error('Regular expression match failed.')

  const [_raw, command, argument] = regExpMatchArray

  switch (command) {
    case COMMANDS.GAME:
      return CHANNEL.onGame({ channel })
    case COMMANDS.SHOUTOUT:
      await hasPermission(userstate)
      return CHANNEL.onShoutout({ channel, argument })
    case COMMANDS.TAGS:
      return CHANNEL.onTags({ channel })
    case COMMANDS.TITLE:
      return CHANNEL.onTitle({ channel })
    case COMMANDS.UPTIME:
      return CHANNEL.onUptime({ channel })

    case COMMANDS.SETGAME:
      await hasPermission(userstate)
      return CHANNEL.onSetGame({ channel, argument })
    case COMMANDS.SETTITLE:
      await hasPermission(userstate)
      return CHANNEL.onSetTitle({ channel, argument })

    case COMMANDS.BOT:
      return MISC.onBot()
    case COMMANDS.ROLL:
      return MISC.onRoll({ userstate })

    case COMMANDS.ADDQUOTE:
      return QUOTES.onAddQuote({ channel, argument })
    case COMMANDS.QUOTE:
      return QUOTES.onQuote({ argument })
    case COMMANDS.EDITQUOTE:
      await hasPermission(userstate)
      return QUOTES.onEditQuote({ argument })
    case COMMANDS.REMOVEQUOTE:
      await hasPermission(userstate)
      return QUOTES.onDeleteQuote({ argument })
    default:
      throw new Error(`No command named ${command} has been initialized.`)
  }
}

export { useActionCommandResolver }
