import Queries from './admins.query';
import { createAndUpdateTokens } from '../helper/jwtToken';

export default class Services {
  static async signIn ({ email, password }) {
    const user = await Queries.getUserByEmail(email.toLowerCase());
    if (!user.checkPassword(password)) throw new Error('Неправильний логін або пароль');
    const { accessToken, refreshToken } = await createAndUpdateTokens(user.id);
    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  static async signUp ({ email, ...rest }) {
    const user = await Queries.createUser({ email: email.toLowerCase(), ...rest });
    const { accessToken, refreshToken } = await createAndUpdateTokens(user.id);
    return {
      accessToken,
      refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
