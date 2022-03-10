const mongoose = require('mongoose')
const { Schema, model } = mongoose

const searchSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    remote: { type: Boolean, required: true },
    role: { type: String, required: true },
    skills: [{ type: String }],
    preferedBadge: [{ type: Object }],
    minimumSalary: { type: Number },
    maximumSalary: { type: Number },
    result: [
      {
        weight: { type: Number, required: true },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    madeBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const SearchModel = model('Search', searchSchema)
module.exports = SearchModel
