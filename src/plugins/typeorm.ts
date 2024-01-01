import { DataSource, DataSourceOptions } from 'typeorm'
import { Quote } from '../lib/models/quote.ts'

const TypeOrmModuleConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'chat_bot_db',
  entities: [Quote],
  synchronize: true
}

const dataSource: DataSource = new DataSource(TypeOrmModuleConfig)

export default dataSource
