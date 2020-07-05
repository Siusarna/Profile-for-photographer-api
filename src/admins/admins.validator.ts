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
            tokens: joi.object({
              accessToken: joi.string(),
              accessExpiresIn: joi.number(),
              refreshToken: joi.string(),
              refreshExpiresIn: joi.number(),
            }),
            user: {
              id: joi.number(),
              firstName: joi.string(),
              lastName: joi.string(),
              username: joi.string(),
              photo: joi.string(),
              inOrganization: joi.bool(),
              RTMP: joi.string().allow(null),
            },
          },
        },
      },
    },
  };
}
