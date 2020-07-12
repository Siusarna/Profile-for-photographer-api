import * as Router from 'koa-joi-router';

import { AdminValidator } from './admins.validator';
import { AdminController } from './admins.controller';
import { checkAuth } from '../middlewares/checkAuth';

const adminRouter = Router();

adminRouter.post(
  '/admin/accounts/sign-in',
  AdminValidator.signIn,
  AdminController.signIn,
);
adminRouter.post(
  '/admin/accounts/sign-up',
  AdminValidator.signUp,
  AdminController.signUp,
);
adminRouter.post(
  '/admin/album',
  AdminValidator.createAlbum,
  checkAuth(),
  AdminController.createAlbum,
);
adminRouter.post(
  '/admin/category',
  AdminValidator.createCategory,
  checkAuth(),
  AdminController.createCategory,
);
adminRouter.post(
  '/admin/photo',
  AdminValidator.uploadPhotos,
  checkAuth(),
  AdminController.uploadPhotos,
);

export default adminRouter;
