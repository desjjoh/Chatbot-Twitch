/**
 * @fileoverview Shared abstract base entity for all database models.
 * @module entities/base
 * @description
 *  Provides common primary key and timestamp columns for all entities.
 *  Extends TypeORM's `BaseEntity` to allow use of static helper methods
 *  such as `find`, `save`, and `remove` directly on derived classes.
 *
 * @remarks
 *  - `id` is the auto-incrementing primary key.
 *  - `createdAt` and `updatedAt` are managed automatically by TypeORM.
 *  - All derived entities inherit these columns by extending this class.
 *
 * @example
 *  import { Entity, Column } from 'typeorm';
 *  import { BaseEntity } from '@/db/base-entity';
 *
 *  @Entity()
 *  export class Quote extends BaseEntity {
 *    @Column() text!: string;
 *    @Column() author!: string;
 *  }
 */

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeORMBase,
} from 'typeorm';

/**
 * Abstract base class defining shared columns for all entities.
 *
 * @extends TypeORMBase
 * @property id - Auto-generated primary key (integer).
 * @property createdAt - Timestamp set when the record is created.
 * @property updatedAt - Timestamp updated automatically on modification.
 */
export abstract class BaseEntity extends TypeORMBase {
  /** Auto-incrementing primary key identifier. */
  @PrimaryGeneratedColumn()
  id!: number;

  /** Timestamp of when the entity was first persisted. */
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  /** Timestamp of the most recent entity update. */
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
