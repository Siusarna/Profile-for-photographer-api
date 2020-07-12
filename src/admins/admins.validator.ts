import * as Router from 'koa-joi-router';

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
      },
      output: {
        200: {
          body: {
            id: joi.string(),
          },
        },
      },
    },
  };
}
