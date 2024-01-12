import 'dotenv/config'

import client from './plugins/tmi.plugin.ts'
import dataSource from './plugins/typeorm.plugin.ts'

import * as EVENTS from './app/events/tmi.events.ts'
import speedrunApiV1 from './app/apis/speedrun/speedrun.api.ts'

// Set TMI.js Event Listeners
// Authentication Events
client.on('connecting', EVENTS.onConnecting)
client.on('logon', EVENTS.onLogon)
client.on('connected', EVENTS.onConnected)
// client.on('join', EVENTS.onJoin)
client.on('disconnected', EVENTS.onDisconnected)
client.on('reconnect', EVENTS.onReconnect)

// Channel Events
client.on('message', EVENTS.onMessage)

// Initialize Plugins
await dataSource.initialize()
await client.connect()

const category = await speedrunApiV1.categories.getCategory('w20z0z8d')
console.log(category.variables)
