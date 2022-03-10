const Joi = require('joi')

module.exports = {
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, 'password')
      .required(),
  }),
  editProfile: Joi.object({
    name: Joi.string().optional().empty(''),
    dob: Joi.date().optional().empty(''),
  }),
  personalityTest: Joi.object({
    answers: Joi.array().items(Joi.object()).required(),
  }),
  linkedinRead: Joi.object({
    linkedinProfile: Joi.string().required(),
  }),
  takeSkillTest: Joi.object({
    code: Joi.string().required(),
    lang: Joi.string().required(),
  }),
  extraInformation: Joi.object({
    relocate: Joi.boolean().required(),
    activeForWork: Joi.boolean().required(),
    location: Joi.string().required(),
    typeOfWork: Joi.string().required(),
    expectedSalary: Joi.number().required(),
    roles: Joi.array().items(Joi.string()).required(),
    skills: Joi.array().items(Joi.string()).required(),
    experience: Joi.array().items(
      Joi.object({
        employerName: Joi.string().required(),
        title: Joi.string().required(),
        location: Joi.string().optional().empty(''),
        workHere: Joi.boolean().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().optional().empty(''),
        summary: Joi.string().optional().empty(''),
      })
    ),
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
