import { DataSource, DataSourceOptions } from 'typeorm'
import { Quote } from '../database/models/quote.ts'

const TypeOrmModuleConfig: DataSourceOptions = {
  type: 'sqlite',
  database: `chatbot.sqlite`,
  entities: [Quote],
  synchronize: true
}

const dataSource: DataSource = new DataSource(TypeOrmModuleConfig)

export default dataSource
