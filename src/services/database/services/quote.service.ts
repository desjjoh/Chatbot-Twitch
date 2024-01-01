import { CreateQuote, Quote } from '../../../lib/models/quote.ts'
import dataSource from '../../../plugins/typeorm.ts'

const quoteRepository = dataSource.getRepository(Quote)

class QuoteService {
  public static async createQuote(payload: CreateQuote): Promise<Quote> {
    return quoteRepository.save(payload)
  }

  public static async getQuote(payload: number): Promise<Quote | null> {
    return quoteRepository.findOneBy({ $id: payload })
  }

  public static async getRandomQuote(): Promise<Quote> {
    const count = await quoteRepository.count()
    const num = Math.floor(Math.random() * count)

    const quote = await quoteRepository.find({ order: { $createdAt: 'ASC' }, skip: num, take: 1 })
    if (!quote.length) throw new Error('No Quotes found.')

    return quote[0]
  }
}

export default QuoteService
