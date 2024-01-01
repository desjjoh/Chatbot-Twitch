import dataSource from '../../plugins/typeorm.ts'
import QuoteService from './services/quote.service.ts'

async function initDatabase() {
  await dataSource.initialize()
}

class DatabaseService {
  public static Quote = QuoteService
}

export default DatabaseService
export { initDatabase }
