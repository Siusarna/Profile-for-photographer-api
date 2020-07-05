import { Context } from 'koa';

export class AdminController {

  static async signIn(ctx: Context) {
    const user = ctx.state.user.getAuthData().user;
    user.inOrganization = false;
    ctx.body = {
      user,
      tokens: ctx.state.user.getAuthData().tokens,
    };
  }
}
