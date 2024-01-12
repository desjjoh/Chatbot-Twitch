type values = { [key: string]: string }
type runs = { place: number; run: run }
type links = { rel: string; uri: string }

type variable = `var-${string}`
type leaderboardParams = { [key: variable]: string; top: number }

type run = {
  id: string
  weblink: string
  game: string
  category: string
}

type leaderboard = {
  data: {
    weblink: string
    game: string
    category: string
    values: values
    runs: runs[]
    links: links[]
  }
}

export { leaderboard, leaderboardParams }
