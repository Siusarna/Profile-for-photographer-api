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
        categoryId: joi.number().required(),
      },
      output: {
        200: {
          body: {
            success: joi.boolean().required(),
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
        albumId: joi.number().required(),
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
  static deleteAlbum: Router.Config = {
    meta: {
      swagger: {
        summary: 'Delete album',
        description: 'Delete album for photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      params: {
        albumId: joi.number().required(),
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

  static updateAlbum: Router.Config = {
    meta: {
      swagger: {
        summary: 'Update album',
        description: 'Update album for photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {
        albumId: joi.number().required(),
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

  static getAlbums: Router.Config = {
    meta: {
      swagger: {
        summary: 'Get all albums',
        description: 'Get all albums without photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {},
      output: {
        200: {
          body: {
            albums: joi.array().items({
              name: joi.string().required(),
              id: joi.number().required(),
            }),
          },
        },
      },
    },
  };

  static getAlbumsByCategory: Router.Config = {
    meta: {
      swagger: {
        summary: 'Get albums by category',
        description: 'Get albums by category without photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {},
      params: {
        categoryId: joi.number().required(),
      },
      output: {
        200: {
          body: {
            albums: joi.array().items({
              name: joi.string().required(),
              id: joi.number().required(),
            }),
          },
        },
      },
    },
  };

  static getAlbumById: Router.Config = {
    meta: {
      swagger: {
        summary: 'Get albums by id',
        description: 'Get albums by id with photo',
        tags: ['admin'],
      },
    },
    validate: {
      type: 'json',
      body: {},
      params: {
        categoryId: joi.number().required(),
        albumId: joi.number().required(),
      },
      output: {
        200: {
          body: {
            name: joi.string().required(),
            id: joi.number().required(),
            photos: joi.array().items({
              url: joi.string().required(),
            }),
          },
        },
      },
    },
  };
}
