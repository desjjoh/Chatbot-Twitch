enum ChatbotActions {
  ACTION_CMD,
  SEND_MSG,
  RANDOM_EVENT
}

enum COMMANDS {
  ADDQUOTE = 'addquote',
  EDITQUOTE = 'editquote',
  REMOVEQUOTE = 'removequote',
  QUOTE = 'quote',

  BOT = 'bot',
  ROLL = 'roll',

  GAME = 'game',
  SETGAME = 'setgame',

  SHOUTOUT = 'shoutout',
  UPTIME = 'uptime',

  TAGS = 'tags',
  SETTAGS = 'settags',

  TITLE = 'title',
  SETTITLE = 'settitle'
}

export { ChatbotActions, COMMANDS }
