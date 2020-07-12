import { Context } from 'koa';
import ParseConfig from '../helper/parseConfig';
import * as config from 'config';
import Services from './admin.services';

export class AdminController {

  static async signIn(ctx: Context) {
    try {
      const { accessToken, refreshToken, ...rest } = await Services.signIn(ctx.request.body);
      ctx.cookies.set('accessToken', accessToken, { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.access.expiresIn')) });
      ctx.cookies.set('refreshToken', refreshToken, { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.refresh.expiresIn')) });
      ctx.body = rest;
      return ctx;
    } catch (error) {
      return ctx.throw(400, error);
    }
  }

  static async signUp(ctx: Context) {
    try {
      const { accessToken, refreshToken, ...rest } = await Services.signUp(ctx.request.body);
      ctx.cookies.set('accessToken', accessToken, { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.access.expiresIn')) });
      ctx.cookies.set('refreshToken', refreshToken, { maxAge: ParseConfig.parseTime(config.get('jwt.tokens.refresh.expiresIn')) });
      ctx.body = rest;
      return ctx;
    } catch (error) {
      return ctx.throw(400, error);
    }
  }

  static async createAlbum(ctx: Context) {
    try {
      ctx.body = await Services.createAlbum(ctx.request.body);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async createCategory(ctx: Context) {
    try {
      ctx.body = await Services.createCategory(ctx.request.body);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }
}
