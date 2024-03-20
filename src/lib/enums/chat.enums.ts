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
  LIST = 'list',
  LURK = 'lurk',

  GAME = 'game',
  SETGAME = 'setgame',

  SO = 'so',
  SHOUTOUT = 'shoutout',
  UPTIME = 'uptime',

  TAGS = 'tags',
  SETTAGS = 'settags',

  TITLE = 'title',
  SETTITLE = 'settitle'
}

export { ChatbotActions, COMMANDS }
