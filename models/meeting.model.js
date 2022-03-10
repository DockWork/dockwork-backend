const mongoose = require('mongoose')
const { Schema, model } = mongoose

const meetingSchema = new Schema(
  {
    madeBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    madeTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: [{ type: String, required: true }],
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: Number, required: true },
    search: {
      type: Schema.Types.ObjectId,
      ref: 'Search',
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

const MeetingModel = model('Meeting', meetingSchema)
module.exports = MeetingModel
