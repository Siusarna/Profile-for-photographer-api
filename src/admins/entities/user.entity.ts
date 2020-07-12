import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

import { IsEmail, IsDefined, Length, validateOrReject } from 'class-validator';
import { Token } from './token.entity';
export const PASSWORD_PATTERN = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})', 'i');

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDefined()
  firstName: string;

  @Column()
  @IsDefined()
  lastName: string;

  @Column({ unique: true })
  @IsEmail({}, { message: '$property field is invalid!' })
  @IsDefined()
  email: string;

  @Column()
  @Length(6, 128)
  @IsDefined()
  password: string;

  @OneToOne(type => Token, token => token.user)
  token: Token;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }

  generatePasswordHash(plainPassword: string) {
    return bcrypt.hashSync(plainPassword, 10);
  }

  checkPassword(plainPassword: string) {
    return bcrypt.compareSync(plainPassword, this.password);
  }

  getAuthData() {
    return {
      user: {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
      },
    };
  }

  getUserData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
  }
}
