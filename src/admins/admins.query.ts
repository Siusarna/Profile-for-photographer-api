import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';

export default class Queries {
  static getUserByEmail (email: string) {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('email = :email', { email })
      .getOne();
  }
  static async createUser (body) {
    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });
    user.password = user.generatePasswordHash(body.password);
    try {
      await user.save();
      return user;
    } catch (e) {
      const err: string = e[0].constraints.IsUserAlreadyExistConstraint;
      if (err.length) throw new Error(err);
      throw new Error(e);
    }
  }
}
