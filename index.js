import 'dotenv/config'

import { client } from './plugins/tmi.js'
import { dataSource } from './plugins/typeorm.js'

await dataSource.initialize()
await client.connect()
