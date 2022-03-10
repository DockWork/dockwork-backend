const mongoose = require('mongoose')
const { Schema, model } = mongoose

const personalitySchema = new Schema(
  {
    mind: {
      type: Schema.Types.ObjectId,
      ref: 'PersonalityData',
    },
    energy: {
      type: Schema.Types.ObjectId,
      ref: 'PersonalityData',
    },
    nature: {
      type: Schema.Types.ObjectId,
      ref: 'PersonalityData',
    },
    tactics: {
      type: Schema.Types.ObjectId,
      ref: 'PersonalityData',
    },
  },
  {
    timestamps: true,
  }
)

const PersonalityModel = model('Personality', personalitySchema)
module.exports = PersonalityModel
