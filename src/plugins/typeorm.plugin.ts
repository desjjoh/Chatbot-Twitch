import { DataSource, DataSourceOptions } from 'typeorm'
import { Quote } from '../apis/localhost/lib/models/quote.ts'

const TypeOrmModuleConfig: DataSourceOptions = {
  type: 'sqlite',
  database: `chatbot.sqlite`,
  entities: [Quote],
  synchronize: true
}

const dataSource: DataSource = new DataSource(TypeOrmModuleConfig)

export default dataSource
