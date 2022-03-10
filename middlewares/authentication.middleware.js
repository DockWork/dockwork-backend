const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const authenticateTokenJobSeeker = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    const user = await User.findOne({ _id: userInfo.id, type: 'JobSeeker' })
    if (!user) return res.status(401).json({ message: 'Not authenticated' })
    req.user = user
    return next()
  })
}

const authenticateTokenCompany = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    const user = await User.findOne({ _id: userInfo.id, type: 'Company' })
    if (!user) return res.status(401).json({ message: 'Not authenticated' })
    req.user = user
    return next()
  })
}
module.exports = { authenticateTokenJobSeeker, authenticateTokenCompany }
