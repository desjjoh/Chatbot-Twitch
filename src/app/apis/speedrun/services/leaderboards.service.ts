import { AxiosResponse } from 'axios'

import { leaderboardParams, leaderboard } from '../types/leaderboards.types.ts'
import { instance } from '../config/speedrun.config.ts'

class leaderboards {
  public static async getLeaderboard(
    gameId: string,
    categoryId: string,
    params?: leaderboardParams
  ): Promise<leaderboard> {
    return instance
      .get<leaderboard>(`leaderboards/${gameId}/category/${categoryId}`, { params })
      .then((e: AxiosResponse) => e.data)
  }
}

export default leaderboards
