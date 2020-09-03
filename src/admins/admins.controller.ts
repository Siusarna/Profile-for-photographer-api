import { Context } from 'koa';
import ParseConfig from '../helper/parseConfig';
import * as config from 'config';
import Services from './admin.services';

export class AdminController {

  static async signIn(ctx: Context) {
    try {
      const { email, password } = ctx.request.body;
      const { accessToken, refreshToken, ...rest } = await Services.signIn(email, password);
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
      const { email, firstName, lastName, password } = ctx.request.body;
      const { accessToken, refreshToken, ...rest } = await Services.signUp(email, firstName, lastName, password);
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
      const { name, categoryId } = ctx.request.body;
      ctx.body = await Services.createAlbum(name, categoryId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async createCategory(ctx: Context) {
    try {
      const { name } = ctx.request.body;
      ctx.body = await Services.createCategory(name);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async uploadPhotos(ctx: Context) {
    try {
      const { albumId, photos } = ctx.request.body;
      ctx.body = await Services.uploadPhotos(albumId, photos);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async deleteAlbum(ctx: Context) {
    try {
      const { albumId } = ctx.request.params;
      ctx.body = await Services.deleteAlbum(albumId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async updateAlbum(ctx: Context) {
    try {
      const { albumId, name } = ctx.request.body;
      ctx.body = await Services.updateAlbum(albumId, name);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async getAlbums(ctx: Context) {
    try {
      ctx.body = await Services.getAlbums();
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async getAlbumsByCategory(ctx: Context) {
    try {
      const { categoryId } = ctx.request.params;
      ctx.body = await Services.getAlbumsByCategory(categoryId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async getAlbumById(ctx: Context) {
    try {
      const { albumId } = ctx.request.params;
      ctx.body = await Services.getAlbumById(albumId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async deleteCategory(ctx: Context) {
    try {
      const { categoryId } = ctx.request.params;
      ctx.body = await Services.deleteCategory(categoryId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async updateCategory(ctx: Context) {
    try {
      const { categoryId, name } = ctx.request.body;
      ctx.body = await Services.updateCategory(categoryId, name);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async getCategories(ctx: Context) {
    try {
      ctx.body = await Services.getCategories();
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

  static async deletePhotos(ctx: Context) {
    try {
      console.log(ctx.request);
      const { photos } = ctx.request.body;
      const { albumId } = ctx.request.params;
      ctx.body = await Services.deletePhotos(photos, albumId);
      return ctx;
    } catch (e) {
      return ctx.throw(e);
    }
  }

}
