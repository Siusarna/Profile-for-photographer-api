import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { v4 as uuidv4 } from 'uuid';
import { getConnection, getRepository } from 'typeorm';
import { Token } from '../admins/entities/token.entity';

const generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: config.get('jwt.tokens.access.type'),
  };
  const options = { expiresIn: config.get('jwt.tokens.access.expiresIn') };
  return jwt.sign(payload, config.get('jwt.secret'), options);
};

const generateRefreshToken = (userId) => {
  const tokenId = uuidv4();
  const payload = {
    tokenId,
    userId,
    type: config.get('jwt.tokens.refresh.type'),
  };
  const options = { expiresIn: config.get('jwt.tokens.refresh.expiresIn') };
  return {
    tokenId,
    refreshToken: jwt.sign(payload, config.get('jwt.secret'), options),
  };
};

const createAndUpdateTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user.id);
    const { tokenId, refreshToken } = generateRefreshToken(user.id);
    const tokenFromDb = await getRepository(Token)
      .createQueryBuilder('token')
      .where('token.user = :user', { user })
      .getOne();
    if (tokenFromDb) {
      await getConnection()
        .createQueryBuilder()
        .update(Token)
        .set({
          tokenId,
        })
        .where('user = :user', { user })
        .execute();
    } else {
      await Token.create({
        tokenId,
        user,
      }).save();
    }
    return {
      refreshToken,
      accessToken,
    };
  } catch (e) {
    throw Error(e.message);
  }
};

export {
  createAndUpdateTokens,
};
