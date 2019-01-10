import * as Joi from 'joi';

export const validator = Joi.object().keys({
  refreshToken: Joi.string()
    .trim()
    .required(),
});
