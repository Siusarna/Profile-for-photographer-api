import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { IsDefined } from 'class-validator';
import { Category } from './category.entity';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsDefined()
  name: string;

  @ManyToOne(type => Category, category => category.albums, { onDelete: 'CASCADE' })
  @JoinColumn()
  category: Category;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
