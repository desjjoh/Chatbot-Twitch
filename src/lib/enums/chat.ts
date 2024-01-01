enum ChatbotActions {
  ACTION_CMD,
  SEND_MSG,
  RANDOM_QUOTE
}

enum COMMANDS {
  ADDQUOTE = 'addquote',
  EDITQUOTE = 'editquote',
  REMOVEQUOTE = 'removequote',
  QUOTE = 'quote',

  SHOUTOUT = 'shoutout',
  UPTIME = 'uptime',

  GAME = 'game',
  SETGAME = 'setgame',

  TITLE = 'title',
  SETTITLE = 'settitle'
}

export { ChatbotActions, COMMANDS }
