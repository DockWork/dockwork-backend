const Joi = require('joi')

module.exports = {
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().required().valid('JobSeeker', 'Company'),
  }),
  registerSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'password')
      .required(),
    gender: Joi.string().required().valid('male', 'female'),
    dob: Joi.date().required(),
    type: Joi.string().required().valid('JobSeeker', 'Company'),
    name: Joi.string().required(),
  }),
  resendToken: Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().required().valid('JobSeeker', 'Company'),
  }),
  verifyRegister: Joi.object({
    validateToken: Joi.string().required(),
  }),
  resetPasswordRequest: Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().required().valid('JobSeeker', 'Company'),
  }),
  resetPasswordSubmit: Joi.object({
    validateToken: Joi.string().required(),
    newPassword: Joi.string()
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'password')
      .required(),
  }),
}
