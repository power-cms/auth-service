import * as Joi from 'joi';

export const validator = Joi.object().keys({
  login: Joi.string()
    .trim()
    .required(),
  password: Joi.string()
    .trim()
    .required(),
});
