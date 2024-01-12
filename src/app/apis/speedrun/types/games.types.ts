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

type moderators = {
  [key: string]: 'moderator' | 'super-moderator'
}

type asset = {
  uri: string
  width: number
  height: number
}

type assets = {
  logo: asset
  ['cover-tiny']: asset
  ['cover-small']: asset
  ['cover-medium']: asset
  ['cover-large']: asset
  icon: asset
  ['trophy-1st']: asset
  ['trophy-2nd']: asset
  ['trophy-3rd']: asset
  ['trophy-4th']: asset | null
  background: asset | null
  foreground: asset | null
}

type links = {
  rel: string
  uri: string
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
  moderators: moderators
  created: Date
  assets: assets
  links: Array<links>
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

type recordsParams = {
  top?: number // only return the top N places (this can result in more than N runs!); this is set to 3 by default
  scope?: 'full-game' | 'levels' | 'all' // when set to full-game, only full-game categories will be included; when set to levels, only individual levels are returned; default is all
  miscellaneous?: boolean // when set to a false value, miscellaneous categories will not be included
  ['skip-empty']?: boolean // when set to a true value, empty leaderboards will not show up in the result
}

export { game, gamesParams, recordsParams }
