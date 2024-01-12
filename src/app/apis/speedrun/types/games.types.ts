// https://github.com/speedruncomorg/api/blob/master/version1/games.md

type names = {
  international: string
  japanese: string | null
  twitch: string
}

type timing = 'realtime' | 'realtime_noloads' | 'ingame'

type ruleset = {
  ['show-milliseconds']: boolean
  ['require-verification']: boolean
  ['require-video']: boolean
  ['run-times']: Array<timing>
  ['default-time']: timing
  ['emulators-allowed']: boolean
}

type game = {
  id: string
  names: names
  abbreviation: string
  weblink: string
  released: number
  ['release-date']: string
  ruleset: ruleset
  romhack: boolean
  gametypes: Array<string>
  platforms: Array<string>
  genres: Array<string>
  developers: Array<string>
  publishers: Array<string>
}

type gamesParams = {
  name?: string // when given, performs a fuzzy search across game names and abbreviations
  abbreviation?: string // when given, performs an exact-match search for this abbreviation
  released?: number // when given, restricts to games released in that year
  gametype?: string // game type ID; when given, restricts to that game type
  platform?: string // platform ID; when given, restricts to that platform
  region?: string // region ID; when given, restricts to that region
  genre?: string // genre ID; when given, restricts to that genre
  engine?: string // engine ID; when given, restricts to that engine
  developer?: string // developer ID; when given, restricts to that developer
  publisher?: string // publisher ID; when given, restricts to that publisher
  moderator?: string // moderator ID; when given, only games moderated by that user will be returned
}

export { game, gamesParams }
