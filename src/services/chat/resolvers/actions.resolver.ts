import { ChatUserstate } from 'tmi.js'

import { ACTION_CMD } from '../../../lib/types/chat.ts'
import { COMMANDS } from '../../../lib/enums/chat.ts'
import { regExpCommand } from '../../../lib/constants/regex.ts'

import * as QUOTES from '../functions/quote.actions.ts'
import * as GAME from '../functions/game.actions.ts'
import * as TITLE from '../functions/title.actions.ts'
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
      return GAME.onGame({ channel })
    case COMMANDS.SETGAME:
      await hasPermission(userstate)
      return GAME.onSetGame({ channel, argument })
    case COMMANDS.SHOUTOUT:
      await hasPermission(userstate)
      return MISC.onShoutout({ channel, argument })
    case COMMANDS.UPTIME:
      return MISC.onUptime({ channel })
    case COMMANDS.TITLE:
      return TITLE.onTitle({ channel })
    case COMMANDS.SETTITLE:
      await hasPermission(userstate)
      return TITLE.onSetTitle({ channel, argument })
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
