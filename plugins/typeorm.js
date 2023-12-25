import typeorm from 'typeorm'
import { counter } from '../models/index.js'

const dataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: 'chatbotDB.txt',
  entities: [counter],
  synchronize: true
})

export { dataSource }
