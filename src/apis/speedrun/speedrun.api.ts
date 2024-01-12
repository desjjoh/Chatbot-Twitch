import categories from './services/categories.service.ts'
import games from './services/games.service.ts'
import leaderboards from './services/leaderboards.service.ts'
import levels from './services/levels.service.ts'

class speedrunApiV1 {
  public static categories = categories
  public static games = games
  public static leaderboards = leaderboards
  public static levels = levels
}

export default speedrunApiV1
