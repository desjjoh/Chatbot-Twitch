import { Column, Entity } from 'typeorm'

import { BaseEntity } from './base.ts'

@Entity()
class Quote extends BaseEntity {
  @Column()
  public gameName!: string
  @Column()
  public gameId!: string
  @Column()
  public quote!: string
}

type CreateQuote = {
  gameName: string
  gameId: string
  quote: string
}

export { Quote, CreateQuote }
