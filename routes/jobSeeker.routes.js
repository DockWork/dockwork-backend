const router = require('express').Router()
const jobSeekerController = require('../controllers/jobSeeker.controller')
const authController = require('../controllers/auth.controller')

const jobSeekerSchema = require('../validations/jobSeeker.validation')
const authSchema = require('../validations/auth.validation')

const validate = require('../middlewares/validation.middleware')
const multipart = require('connect-multiparty')
const multipartMiddleware = multipart()
const {
  authenticateTokenJobSeeker,
} = require('../middlewares/authentication.middleware')

router.get(
  '/profile',
  authenticateTokenJobSeeker,
  jobSeekerController.getProfile
)

router.put(
  '/profile',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.editProfile),
  jobSeekerController.editProfile
)

router.post(
  '/profile/password',
  authenticateTokenJobSeeker,
  validate(authSchema.changePassword),
  authController.changePassword
)

router.post(
  '/personalityTest',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.personalityTest),
  jobSeekerController.personalityTest
)

router.get(
  '/personalityTest',
  authenticateTokenJobSeeker,
  jobSeekerController.getPersonalityTest
)

router.post(
  '/pdfRead',
  multipartMiddleware,
  authenticateTokenJobSeeker,
  jobSeekerController.pdfRead
)

router.post(
  '/takeSkillTest/:testId',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.takeSkillTest),
  jobSeekerController.takeSkillTest
)

router.get(
  '/takeSkillTest/:testId',
  authenticateTokenJobSeeker,
  jobSeekerController.getSkillTest
)

router.get(
  '/randomTest/:language/:level',
  authenticateTokenJobSeeker,
  jobSeekerController.getRandomSkillTest
)

router.get(
  '/skills',
  authenticateTokenJobSeeker,
  jobSeekerController.getUserSkills
)

router.get(
  '/dashboard',
  authenticateTokenJobSeeker,
  jobSeekerController.getDashboard
)

router.get(
  '/extraInfo',
  authenticateTokenJobSeeker,
  jobSeekerController.getExtraInformation
)

router.post(
  '/extraInfo',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.extraInformation),
  jobSeekerController.extraInformation
)

router.get(
  '/notification',
  authenticateTokenJobSeeker,
  jobSeekerController.getNotification
)

router.get(
  '/pendingRequests',
  authenticateTokenJobSeeker,
  jobSeekerController.getPending
)

router.put(
  '/respond',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.respondToRequest),
  jobSeekerController.respondToRequest
)

router.put(
  '/notification',
  authenticateTokenJobSeeker,
  validate(jobSeekerSchema.readNotification),
  jobSeekerController.readNotification
)

module.exports = router
