const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, required: true },
    type: { type: String, trim: true, required: true, default: 'JobSeeker' },
    gender: { type: String, trim: true, required: true, default: 'male' },
    dob: { type: Date, required: true },
    avatar: { type: Number, required: true },
    validateToken: { type: String, required: false },
    emailVerifiedAt: { type: Date, required: false },
    personality: {
      type: Schema.Types.ObjectId,
      ref: 'Personality',
    },
    skills: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
    },
    extraInfo: {
      type: Schema.Types.ObjectId,
      ref: 'ExtraInfo',
    },
  },
  {
    timestamps: true,
  }
)

const UserModel = model('User', userSchema)
module.exports = UserModel
