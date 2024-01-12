import axios, { AxiosResponse } from 'axios'
import { leaderboard, leaderboardParams } from '../../lib/types/speedrun.types'

const baseURL = 'https://www.speedrun.com/api/v1/'
const instance = axios.create({
  baseURL,
  timeout: 1000,
  headers: { ['Content-Type']: 'application/json' }
})

class speedrunApiV1 {
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

export default speedrunApiV1
