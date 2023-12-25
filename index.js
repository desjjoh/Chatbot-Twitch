import 'dotenv/config'

import { client } from './plugins/tmi.js'
import { dataSource } from './plugins/typeorm.js'
import { chatbot } from './queues/chatbot.js'

await chatbot.empty()
await dataSource.initialize()
await client.connect()
