// https://github.com/speedruncomorg/api/blob/master/version1/games.md

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

export { gamesParams }
