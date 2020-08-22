import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn, OneToMany,
} from 'typeorm';

import { IsDefined } from 'class-validator';
import { Category } from './category.entity';
import { Photo } from './photo.entity';

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

  @OneToMany(type => Photo, photo => photo.album, { onDelete: 'CASCADE' })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
