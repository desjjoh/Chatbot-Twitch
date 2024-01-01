enum ChatbotActions {
  ACTION_CMD,
  SEND_MSG,
  RANDOM_QUOTE
}

enum COMMANDS {
  ADDQUOTE = 'addquote',
  QUOTE = 'quote',

  FOLLOWAGE = 'followage',
  GAME = 'game',
  SHOUTOUT = 'shoutout',
  TITLE = 'title',
  UPTIME = 'uptime',

  SETGAME = 'setgame',
  SETTITLE = 'settitle'
}

export { ChatbotActions, COMMANDS }
