import { ChatUserstate } from 'tmi.js'

import { ACTION_CMD } from '../../lib/types/chat.types.ts'
import { COMMANDS } from '../../lib/enums/chat.enums.ts'
import { regExpCommand } from '../../lib/constants/regex.constants.ts'

import QuoteActions from '../services/quote.service.ts'
import ChannelActions from '../services/channel.service.ts'
import MiscActions from '../services/misc.service.ts'

async function hasPermission(userstate: ChatUserstate): Promise<void> {
  const authorized = userstate.badges?.broadcaster || userstate.mod
  if (!authorized) throw new Error(`User ${userstate.username} does not have permission to complete this action.`)
}

async function useActionCommandResolver({ channel, userstate, message }: ACTION_CMD): Promise<string> {
  const regExpMatchArray: RegExpMatchArray | null = message.match(regExpCommand)
  if (!regExpMatchArray) throw new Error('Regular expression match failed.')

  const [_raw, command, argument] = regExpMatchArray

  switch (command.toLowerCase()) {
    case COMMANDS.GAME:
      return ChannelActions.onGame({ channel })
    case COMMANDS.TAGS:
      return ChannelActions.onTags({ channel })
    case COMMANDS.TITLE:
      return ChannelActions.onTitle({ channel })
    case COMMANDS.UPTIME:
      return ChannelActions.onUptime({ channel })

    case COMMANDS.SETGAME:
      await hasPermission(userstate)
      return ChannelActions.onSetGame({ channel, argument })
    case COMMANDS.SETTITLE:
      await hasPermission(userstate)
      return ChannelActions.onSetTitle({ channel, argument })

    case COMMANDS.SO:
    case COMMANDS.SHOUTOUT:
      await hasPermission(userstate)
      return ChannelActions.onShoutout({ channel, argument })

    case COMMANDS.BOT:
      return MiscActions.onBot()
    case COMMANDS.LIST:
      return MiscActions.onList()

    case COMMANDS.ROLL:
      return MiscActions.onRoll({ userstate })
    case COMMANDS.LURK:
      return MiscActions.onLurk({ userstate })

    case COMMANDS.ADDQUOTE:
      return QuoteActions.onAddQuote({ channel, argument })
    case COMMANDS.QUOTE:
      return QuoteActions.onQuote({ argument })
    case COMMANDS.EDITQUOTE:
      await hasPermission(userstate)
      return QuoteActions.onEditQuote({ argument })
    case COMMANDS.REMOVEQUOTE:
      await hasPermission(userstate)
      return QuoteActions.onDeleteQuote({ argument })

    default:
      throw new Error(`No command named ${command} has been initialized.`)
  }
}

export { useActionCommandResolver }
