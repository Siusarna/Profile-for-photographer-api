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
import { Album } from './album.entity';

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDefined()
  url: string;

  @ManyToOne(type => Album, album => album.photos, { onDelete: 'CASCADE' })
  @JoinColumn()
  album: Album;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
