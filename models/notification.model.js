const mongoose = require('mongoose')
const { Schema, model } = mongoose

const notificationSchema = new Schema(
  {
    madeBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    madeTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    meeting: {
      type: Schema.Types.ObjectId,
      ref: 'Meeting',
    },
    type: { type: String, required: true },
    viewed: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
)

const NotificationModel = model('Notification', notificationSchema)
module.exports = NotificationModel
