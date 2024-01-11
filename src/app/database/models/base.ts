import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  public $id!: number
  @CreateDateColumn()
  public $createdAt!: Date
  @UpdateDateColumn()
  public $updatedAt!: Date
}

export { BaseEntity }
