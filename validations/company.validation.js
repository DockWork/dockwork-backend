const Joi = require('joi')

module.exports = {
  editProfile: Joi.object({
    name: Joi.string().optional().empty(''),
    dob: Joi.date().optional().empty(''),
  }),
  advancedSearch: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    remote: Joi.boolean().required(),
    role: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).required(),
    preferedBadge: Joi.array()
      .items({
        name: Joi.string().required(),
        level: Joi.number().required(),
      })
      .required(),
    minimumSalary: Joi.number().required(),
    maximumSalary: Joi.number().required(),
  }),
  requestMeeting: Joi.object({
    madeTo: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string()
      .regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'time')
      .required(),
    link: Joi.string().uri().required(),
    search: Joi.string().required(),
    name: Joi.string().required(),
  }),
  respondToRequest: Joi.object({
    response: Joi.string().required(),
    meetingId: Joi.string().required(),
    date: Joi.date().optional().empty(''),
    time: Joi.string().optional().empty(''),
    message: Joi.string().optional().empty(''),
  }),
  readNotification: Joi.object({
    ids: Joi.array().items(Joi.string()).required(),
  }),
}
