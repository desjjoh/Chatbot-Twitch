import typeorm from 'typeorm'

import { counter } from '../config/database.entities.js'

const dataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: 'chatbotDB.txt',
  entities: [counter],
  synchronize: true
})

export { dataSource }
