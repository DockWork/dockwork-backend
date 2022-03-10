const mongoose = require('mongoose')
const { Schema, model } = mongoose

const personalityDataSchema = new Schema(
  {
    category: {
      type: String,
    },
    // mind
    // energy
    // nature
    // tactics
    letter: { type: String },
    name: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
)

const personalityDataModel = model('PersonalityData', personalityDataSchema)
module.exports = personalityDataModel
