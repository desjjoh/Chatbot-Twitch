import typeorm from 'typeorm'

const dataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: 'chatbotDB',
  entities: [],
  synchronize: true
})

export { dataSource }
