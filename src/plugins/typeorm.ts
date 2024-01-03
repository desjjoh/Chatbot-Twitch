import { DataSource, DataSourceOptions } from 'typeorm'

import { Quote } from '../lib/models/quote.ts'

declare const process: {
  env: {
    DB_HOST: string
    DB_PORT: number
    DB_USER: string
    DB_PASSWORD: string
    DB_DATABASE: string
  }
}

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env

const TypeOrmModuleConfig: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [Quote],
  synchronize: true
}

const dataSource: DataSource = new DataSource(TypeOrmModuleConfig)

export default dataSource
