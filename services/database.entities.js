import { EntitySchema } from 'typeorm'

const counter = new EntitySchema({
  name: 'Counter',
  tableName: 'counters',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: 'true'
    },
    name: {
      type: 'varchar'
    },
    value: {
      type: 'int'
    }
  }
})

export { counter }
