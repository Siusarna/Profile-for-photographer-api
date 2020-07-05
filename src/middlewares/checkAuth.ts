const jwt = require('jsonwebtoken');
const config = require('config');
const { createAndUpdateTokens } = require('../utils/jwtToken');
const { getUserById } = require('../accounts/queries');
const { parseTimeFromConfig } = require('../utils/parseConfig');

const setTokens = (ctx, tokens) => {
  const { accessToken, refreshToken } = tokens;
  ctx.cookies.set('accessToken', accessToken, { maxAge: parseTimeFromConfig(config.jwt.tokens.access.expiresIn) });
  ctx.cookies.set('refreshToken', refreshToken, { maxAge: parseTimeFromConfig(config.jwt.tokens.refresh.expiresIn) });
};

const processingRefreshToken = async (refreshToken, ctx, next) => {
  if (!refreshToken) {
    return ctx.throw(401, 'Tokens expired, please log in again');
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwt.secret);
    if (payload.type !== 'refresh') {
      return ctx.throw(400, 'Invalid token, please log in again');
    }
  } catch (e) {
    return ctx.throw(400, 'Invalid token, please log in again');
  }
  const tokens = await createAndUpdateTokens(payload.userId);
  ctx.state.tokens = tokens;
  setTokens(ctx, tokens);
  return next();
};

export default async (ctx, next) => {
  if (!ctx.cookies) {
    return ctx.throw(400, 'Unauthorized');
  }
  const accessToken = ctx.cookies.get('accessToken') || ctx.request.headers.accesstoken;
  const refreshToken = ctx.cookies.get('refreshToken') || ctx.request.headers.refreshtoken;
  if (!accessToken) {
    return processingRefreshToken(refreshToken, ctx, next);
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, config.jwt.secret);
  } catch (e) {
    return processingRefreshToken(refreshToken, ctx, next);
  }
  if (payload.type !== 'access') {
    return ctx.throw(400, 'Invalid token, please log in again');
  }
  const [user] = await getUserById(payload.userId);
  ctx.state.user = user;
  return next();
};

