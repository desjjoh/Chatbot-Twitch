import 'dotenv/config'

import { client } from './plugins/tmi.ts'
import { dataSource } from './plugins/typeorm.ts'

import {
  onConnecting,
  onLogon,
  onConnected,
  onJoin,
  onDisconnected,
  onReconnect,
  onMessage,
  onRaided,
  onRedeem
} from './services/chat/chat.listeners.ts'

await new Promise<void>(async (resolve, _reject) => {
  await dataSource.initialize()

  client.on('connecting', onConnecting)
  client.on('logon', onLogon)
  client.on('connected', onConnected)
  client.on('join', onJoin)

  client.on('disconnected', onDisconnected)
  client.on('reconnect', onReconnect)

  client.on('message', onMessage)
  client.on('raided', onRaided)
  client.on('redeem', onRedeem)

  await client.connect()

  resolve()
})
  .then(() => {})
  .catch((reason: any) => {
    console.log(reason)
  })
