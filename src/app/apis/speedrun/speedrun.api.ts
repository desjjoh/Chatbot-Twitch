import axios from 'axios'

import leaderboards from './services/leaderboards.service.ts'

const baseURL = 'https://www.speedrun.com/api/v1/'
const instance = axios.create({
  baseURL,
  timeout: 1000,
  headers: { ['Content-Type']: 'application/json' }
})

class speedrunApiV1 {
  public static leaderboards = leaderboards
}

export default speedrunApiV1
export { instance }
