import 'dotenv/config'

import client from './plugins/tmi.plugin.ts'
import dataSource from './plugins/typeorm.plugin.ts'

import TMI from './app/services/tmi.service.ts'

// Set TMI.js Event Listeners
// Authentication Events
client.on('connecting', TMI.EventListeners.onConnecting)
client.on('logon', TMI.EventListeners.onLogon)
client.on('connected', TMI.EventListeners.onConnected)
client.on('join', TMI.EventListeners.onJoin)
client.on('disconnected', TMI.EventListeners.onDisconnected)
client.on('reconnect', TMI.EventListeners.onReconnect)

// Channel Events
client.on('message', TMI.EventListeners.onMessage)

// Initialize Plugins
await dataSource.initialize()
await client.connect()
