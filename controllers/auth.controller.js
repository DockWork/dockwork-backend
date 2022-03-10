const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { generateAccessToken } = require('../helpers/jwt.helper')
const { generateRegistrationToken } = require('../helpers/randomToken.helper')
const { sendEmail } = require('../config/mail.config')
const moment = require('moment')

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email, password, type } = req.body
      const user = await User.findOne({ email, type })
      if (!user)
        return res
          .status(422)
          .json({ message: 'The provided credentials are incorrect' })

      if (!bcrypt.compareSync(password, user.password))
        return res
          .status(422)
          .json({ message: 'The provided credentials are incorrect' })

      if (!user.emailVerifiedAt) {
        return res.status(333).json({
          message: 'Email not verified',
          url: `/${type === 'JobSeeker' ? 'js' : 'rc'}/register/resend/${
            user.email
          }`,
        })
      }

      const loginUser = {
        name: user.name,
        email: user.email,
        type: user.type,
        id: user._id,
      }
      const accessToken = generateAccessToken(loginUser)
      return res.status(200).json({
        accessToken,
        name: user.name,
        type: user.type,
        avatar: user.avatar,
      })
    } catch (err) {
      next(err)
    }
  },
  register: async (req, res, next) => {
    try {
      const { email, password, name, type, gender, dob } = req.body
      const userChecker = await User.findOne({ email, type })
      if (userChecker)
        return res
          .status(400)
          .json({ message: `${email} already a user as ${type}` })

      let encryptedPassword = bcrypt.hashSync(password, 10)
      let validateToken = generateRegistrationToken()
      await User.create({
        email,
        name,
        type,
        gender,
        dob,
        validateToken,
        password: encryptedPassword,
        avatar: Math.floor(Math.random() * 3 + 1),
      })
      await sendEmail({
        email,
        subject: 'Verification',
        message: `Click the following link to verify your account: ${
          process.env.FRONT_END_URL
        }/${
          type === 'JobSeeker' ? 'js' : 'rc'
        }/register/verify/${validateToken}`,
      })
      return res
        .status(200)
        .json({ message: 'Verification email has been sent' })
    } catch (err) {
      next(err)
    }
  },
  resendToken: async (req, res, next) => {
    try {
      const { email, type } = req.body
      const userChecker = await User.findOne({ email, type })
      if (!userChecker) {
        return res.status(404).json({ message: 'User not found' })
      }
      await sendEmail({
        email,
        subject: 'Verification',
        message: `Click the following link to verify your account: ${
          process.env.FRONT_END_URL
        }/${type === 'JobSeeker' ? 'js' : 'rc'}/register/verify/${
          userChecker.validateToken
        }`,
      })
      return res.status(200).json({ message: 'Verification email sent' })
    } catch (err) {
      next(err)
    }
  },
  verifyRegister: async (req, res, next) => {
    try {
      const { validateToken } = req.body
      const user = await User.findOne({ validateToken })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      await User.updateOne(
        { _id: user._id },
        { emailVerifiedAt: moment(), validateToken: '' }
      )
      return res.status(200).json({ message: 'User has been verified' })
    } catch (err) {
      next(err)
    }
  },
  resetPasswordRequest: async (req, res, next) => {
    try {
      const { email, type } = req.body
      const user = await User.findOne({ type, email })
      if (!user) return res.status(404).json({ message: 'User not found' })
      let validateToken = generateRegistrationToken()
      await User.updateOne({ _id: user._id }, { validateToken })
      await sendEmail({
        email,
        subject: 'Reset Password',
        message: `Click the following link to reset your password: ${
          process.env.FRONT_END_URL
        }/${
          type === 'JobSeeker' ? 'js' : 'rc'
        }/password/reset/${validateToken}`,
      })
      return res.status(200).json({ message: 'Reset password email sent' })
    } catch (err) {
      next(err)
    }
  },
  resetPasswordSubmit: async (req, res, next) => {
    try {
      const { validateToken, newPassword } = req.body
      const user = await User.findOne({ validateToken })
      if (!user) return res.status(404).json({ message: 'User not found' })
      let encryptedPassword = bcrypt.hashSync(newPassword, 10)
      await User.updateOne(
        { _id: user._id },
        { password: encryptedPassword, validateToken: '' }
      )
      return res.status(200).json({ message: 'Password has been reset' })
    } catch (err) {
      next(err)
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body
      if (!bcrypt.compareSync(oldPassword, req.user.password))
        return res
          .status(422)
          .json({ message: 'The provided credentials are incorrect' })

      let encryptedPassword = bcrypt.hashSync(newPassword, 10)
      await User.updateOne(
        { _id: req.user.id },
        { password: encryptedPassword }
      )
      return res.status(200).json({ message: 'Password has been changed' })
    } catch (err) {
      next(err)
    }
  },
}
