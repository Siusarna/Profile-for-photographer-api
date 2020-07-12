import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn, Column,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tokenId: string;

  @OneToOne(type => User, user => user.token, { onDelete: 'SET NULL' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

}
