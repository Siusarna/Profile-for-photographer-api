import * as Router from 'koa-joi-router';

import { AdminValidator } from './admins.validator';
import { AdminController } from './admins.controller';
import checkAuth from '../middlewares/checkAuth';

const adminRouter = Router();

adminRouter.post(
  '/admin/accounts/sign-in',
  AdminValidator.signIn,
  checkAuth,
  AdminController.signIn,
);

export default adminRouter;
