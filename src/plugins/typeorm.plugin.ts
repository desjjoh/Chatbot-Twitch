import { DataSource, DataSourceOptions } from 'typeorm'

import { Quote } from '../app/database/models/quote.ts'

declare const process: {
  env: {
    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASSWORD: string
    DB_DATABASE: string
  }
}

const TypeOrmModuleConfig: DataSourceOptions = {
  type: 'sqlite',
  database: `chatbot.sqlite`,
  entities: [Quote],
  synchronize: true
}

const dataSource: DataSource = new DataSource(TypeOrmModuleConfig)

export default dataSource
