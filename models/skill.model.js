const mongoose = require('mongoose')
const { Schema, model } = mongoose

const skillSchema = new Schema(
  {
    skills: { type: Object },
  },
  {
    timestamps: true,
  }
)

const SkillModel = model('Skill', skillSchema)
module.exports = SkillModel
