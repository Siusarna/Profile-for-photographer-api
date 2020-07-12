import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { v4 as uuidv4 } from 'uuid';
import { getConnection, getRepository } from 'typeorm';
import { Token } from '../admins/entities/token.entity';
import { User } from '../admins/entities/user.entity';

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
    type: config.get('jwt.tokens.refresh.type'),
    tokenId,
    userId,
  };
  const options = { expiresIn: config.get('jwt.tokens.refresh.expiresIn') };
  return {
    refreshToken: jwt.sign(payload, config.get('jwt.secret'), options),
    tokenId,
  };
};

const createAndUpdateTokens = async (userId) => {
  try {
    const accessToken = generateAccessToken(userId);
    const { tokenId, refreshToken } = generateRefreshToken(userId);
    const tokenFromDb = await getRepository(Token)
      .createQueryBuilder('token')
      .where('token.userId = :userId', {userId})
      .getOne();
    if (tokenFromDb) {
      await getConnection()
        .createQueryBuilder()
        .update(Token)
        .set({
          tokenId,
        })
        .where('userId = :userId', { userId })
        .execute();
    } else {
      const user = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', {userId})
        .getOne();
      await Token.create({
        tokenId,
        user
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

module.exports = {
  createAndUpdateTokens,
};
