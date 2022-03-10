const router = require('express').Router()
const companyController = require('../controllers/company.controller')
const authController = require('../controllers/auth.controller')

const companySchema = require('../validations/company.validation')
const authSchema = require('../validations/auth.validation')

const validate = require('../middlewares/validation.middleware')
const {
  authenticateTokenCompany,
} = require('../middlewares/authentication.middleware')

router.get('/profile', authenticateTokenCompany, companyController.getProfile)

router.put(
  '/profile',
  authenticateTokenCompany,
  validate(companySchema.editProfile),
  companyController.editProfile
)

router.post(
  '/profile/password',
  authenticateTokenCompany,
  validate(authSchema.changePassword),
  authController.changePassword
)

router.post(
  '/match',
  authenticateTokenCompany,
  validate(companySchema.advancedSearch),
  companyController.advancedSearch
)

router.get(
  '/match/:searchId',
  authenticateTokenCompany,
  companyController.getSearchResult
)

router.get(
  '/dashboard',
  authenticateTokenCompany,
  companyController.getDashboard
)
router.post(
  '/requestMeeting',
  authenticateTokenCompany,
  validate(companySchema.requestMeeting),
  companyController.requestMeeting
)

router.put(
  '/respond',
  authenticateTokenCompany,
  validate(companySchema.respondToRequest),
  companyController.respondToRequest
)

router.get(
  '/notification',
  authenticateTokenCompany,
  companyController.getNotifications
)

router.put(
  '/notification',
  authenticateTokenCompany,
  validate(companySchema.readNotification),
  companyController.readNotification
)

router.get(
  '/pendingRequests',
  authenticateTokenCompany,
  companyController.getPending
)

module.exports = router
