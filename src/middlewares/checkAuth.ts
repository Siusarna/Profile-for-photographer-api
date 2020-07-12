import * as Koa from 'koa';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import Queries from '../admins/admins.query';

import { createAndUpdateTokens } from '../helper/jwtToken';
import ParseConfig from '../helper/parseConfig';

const setTokens = (ctx, tokens) => {
  const { accessToken, refreshToken } = tokens;
  ctx.cookies.set(
    'accessToken',
    accessToken,
    { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.access.expiresIn')) },
    );
  ctx.cookies.set(
    'refreshToken',
    refreshToken,
    { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.refresh.expiresIn')) },
    );
};

const processingRefreshToken = async (refreshToken: string, ctx: Koa.Context, next: () => Promise<any>) => {
  if (!refreshToken) {
    return ctx.throw(401, 'Tokens expired, please log in again');
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, config.get('jwt.secret'));
    if (payload.type !== 'refresh') {
      return ctx.throw(400, 'Invalid token, please log in again');
    }
  } catch (e) {
    return ctx.throw(400, 'Invalid token, please log in again');
  }
  const tokens = await createAndUpdateTokens(payload.userId);
  ctx.state.tokens = tokens;
  setTokens(ctx, tokens);
  return await next();
};

export const checkAuth = () => {
  return async(ctx: Koa.Context, next: () => Promise<any>) => {
    if (!ctx.cookies) {
      return ctx.throw(400, 'Unauthorized');
    }
    const accessToken: string = ctx.cookies.get('accessToken') || ctx.request.headers.accesstoken;
    const refreshToken: string = ctx.cookies.get('refreshToken') || ctx.request.headers.refreshtoken;
    if (!accessToken) {
      return processingRefreshToken(refreshToken, ctx, next);
    }
    let payload;
    try {
      payload = jwt.verify(accessToken, config.get('jwt.secret'));
    } catch (e) {
      return processingRefreshToken(refreshToken, ctx, next);
    }
    if (payload.type !== 'access') {
      return ctx.throw(400, 'Invalid token, please log in again');
    }
    ctx.state.user = await Queries.getUserById(payload.userId);
    return await next();
  };
};
