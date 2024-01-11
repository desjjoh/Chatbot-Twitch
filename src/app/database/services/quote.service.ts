import { CreateQuote, EditQuote, Quote } from '../models/quote.ts'
import dataSource from '../../../plugins/typeorm.plugin.ts'

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

  public static async editQuote(payload: EditQuote): Promise<Quote> {
    const { id, quote } = payload
    const old_quote = await quoteRepository.findOneBy({ $id: id })
    if (!old_quote) throw new Error(`Quote with id #${id} was not found.`)
    return quoteRepository.save({ ...old_quote, quote })
  }

  public static async deleteQuote(payload: number): Promise<Quote> {
    const quote = await quoteRepository.findOneBy({ $id: payload })
    if (!quote) throw new Error(`Quote with id ${payload} was not found.`)
    return quoteRepository.remove(quote)
  }
}

export default QuoteService
