import { DataSource, DataSourceOptions } from 'typeorm'

const options: DataSourceOptions = {
  type: 'sqlite',
  database: './database.sqlite',
  entities: [],
  synchronize: true
}

const dataSource: DataSource = new DataSource(options)

export { dataSource }
