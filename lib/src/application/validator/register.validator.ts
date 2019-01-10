import * as Joi from 'joi';

export const validator = Joi.object().keys({
  password: Joi.string()
    .trim()
    .required(),
});
