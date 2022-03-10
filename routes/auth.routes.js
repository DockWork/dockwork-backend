const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const validate = require('../middlewares/validation.middleware')
const authSchema = require('../validations/auth.validation')

router.post('/login', validate(authSchema.loginSchema), authController.login)

router.post(
  '/register',
  validate(authSchema.registerSchema),
  authController.register
)

router.post(
  '/register/resend',
  validate(authSchema.resendToken),
  authController.resendToken
)

router.post(
  '/register/verify',
  validate(authSchema.verifyRegister),
  authController.verifyRegister
)

router.post(
  '/password/request',
  validate(authSchema.resetPasswordRequest),
  authController.resetPasswordRequest
)

router.post(
  '/password/submit',
  validate(authSchema.resetPasswordSubmit),
  authController.resetPasswordSubmit
)

module.exports = router
