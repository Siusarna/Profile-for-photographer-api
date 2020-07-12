import * as Router from 'koa-joi-router';
import { validateFileTypeAndSize } from '../helper/photoValidate';
import { Context } from 'koa';

const PASSWORD_PATTERN = new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})', 'i');

const joi = Router.Joi;
const joiPassword = joi.string().regex(PASSWORD_PATTERN).required().min(6).error(new Error('Password Must contain a number, a character and be 6 characters long'));

export class AdminValidator {
  static signIn: Router.Config = {
    meta: {
      swagger: {
        summary: 'Admin sign in',
        description: 'Sign in admin by email and password',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {
        email: joi.string().required(),
        password: joiPassword,
      },
      output: {
        200: {
          body: {
            firstName: joi.string(),
            lastName: joi.string(),
          },
        },
      },
    },
  };
  static signUp: Router.Config = {
    meta: {
      swagger: {
        summary: 'Admin sign up',
        description: 'Sign up admin',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {
        email: joi.string().required(),
        password: joiPassword,
        firstName: joi.string().required(),
        lastName: joi.string().required(),
      },
      output: {
        200: {
          body: {
            firstName: joi.string(),
            lastName: joi.string(),
          },
        },
      },
    },
  };
  static createAlbum: Router.Config = {
    meta: {
      swagger: {
        summary: 'Create album',
        description: 'Create album for photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {
        name: joi.string().required(),
        categoryId: joi.string().required(),
      },
      output: {
        200: {
          body: {
            id: joi.number(),
          },
        },
      },
    },
  };
  static createCategory: Router.Config = {
    meta: {
      swagger: {
        summary: 'Create category',
        description: 'Create category for album',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {
        name: joi.string().required(),
      },
      output: {
        200: {
          body: {
            success: joi.boolean(),
          },
        },
      },
    },
  };
  static uploadPhotos: Router.Config = {
    meta: {
      swagger: {
        summary: 'Upload photo',
        description: 'Upload photo in the album',
        tags: ['admin'],
      },
    },
    pre: async (ctx: Context, next: () => Promise<any>) => {
      await validateFileTypeAndSize(ctx, 'photos');
      await next();
    },
    validate: {
      type: 'json',
      body: {
        albumId: joi.string().required(),
        photos: joi.array().items(joi.string()).required(),
      },
      output: {
        200: {
          body: {
            success: joi.boolean(),
          },
        },
      },
    },
  };
}
