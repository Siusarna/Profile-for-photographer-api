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
adminRouter.delete(
  '/admin/album/:albumId',
  AdminValidator.deleteAlbum,
  checkAuth(),
  AdminController.deleteAlbum,
);
adminRouter.put(
  '/admin/album',
  AdminValidator.updateAlbum,
  checkAuth(),
  AdminController.updateAlbum,
);
adminRouter.get(
  '/album',
  AdminValidator.getAlbums,
  AdminController.getAlbums,
);
adminRouter.get(
  '/album/:categoryId',
  AdminValidator.getAlbumsByCategory,
  AdminController.getAlbumsByCategory,
);
adminRouter.get(
  '/album/:categoryId/:albumId',
  AdminValidator.getAlbumById,
  AdminController.getAlbumById,
);
adminRouter.post(
  '/admin/category',
  AdminValidator.createCategory,
  checkAuth(),
  AdminController.createCategory,
);
adminRouter.delete(
  '/admin/category/:categoryId',
  AdminValidator.deleteCategory,
  checkAuth(),
  AdminController.deleteCategory,
);
adminRouter.put(
  '/admin/category',
  AdminValidator.updateCategory,
  checkAuth(),
  AdminController.updateCategory,
);
adminRouter.get(
  '/category',
  AdminValidator.getCategories,
  AdminController.getCategories,
);
adminRouter.post(
  '/admin/photo',
  AdminValidator.uploadPhotos,
  checkAuth(),
  AdminController.uploadPhotos,
);
adminRouter.delete(
  '/admin/:albumId/photo',
  AdminValidator.deletePhotos,
  checkAuth(),
  AdminController.deletePhotos,
);

export default adminRouter;
