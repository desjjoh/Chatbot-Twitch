type CreateQuote = {
  gameName: string
  gameId: string
  quote: string
}

type EditQuote = {
  id: number
  quote: string
}

export { CreateQuote, EditQuote }
