import 'dotenv/config'

import client from './plugins/tmi.plugin.ts'
// import dataSource from './plugins/typeorm.plugin.ts'

import * as EVENTS from './app/events/tmi.events.ts'
import speedrunApiV1 from './apis/speedrun/speedrun.api.ts'
import { game } from './apis/speedrun/types/games.types.ts'
import { variable } from './apis/speedrun/types/variables.types.ts'

// Set TMI.js Event Listeners
// Authentication Events
client.on('connecting', EVENTS.onConnecting)
client.on('logon', EVENTS.onLogon)
client.on('connected', EVENTS.onConnected)
client.on('join', EVENTS.onJoin)
client.on('disconnected', EVENTS.onDisconnected)
client.on('reconnect', EVENTS.onReconnect)

// Channel Events
client.on('message', EVENTS.onMessage)

// Initialize Plugins
// await dataSource.initialize()
// await client.connect()

const game: game = await speedrunApiV1.games.getGameById('kdkrvl6m')
console.log(game.variables?.data.map((variable: variable) => variable.name))

const leaderboard = await speedrunApiV1.leaderboards.getLeaderboardByCategory(
  'kdkrvl6m', // Final Fantasy VII
  'w20z0z8d' // PSX Disc
)

console.log(leaderboard)
