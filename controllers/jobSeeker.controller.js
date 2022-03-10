const User = require('../models/user.model')
const Personality = require('../models/personality.model')
const PersonalityData = require('../models/personalityData.model')
const Skill = require('../models/skill.model')
const Test = require('../models/test.model')
const ExtraInfo = require('../models/extraInfo.model')
const Meeting = require('../models/meeting.model')
const Notification = require('../models/notification.model')
// const pdf = require('pdf-parse')
// const fs = require('fs')
const moment = require('moment')
const ResumeParser = require('simple-resume-parser')
const personalityAnswers = require('../helpers/data/personalityAnswers')

module.exports = {
  personalityTest: async (req, res, next) => {
    try {
      const answersArray = ['A', 'B', 'C']
      const result = {
        e: 0,
        i: 0,
        s: 0,
        n: 0,
        t: 0,
        f: 0,
        j: 0,
        p: 0,
      }
      const { answers } = req.body
      for (let i = 0; i < answers.length; i++) {
        const zone = answers[i]
        const questionNumber = Object.keys(zone)[0]
        const answer = Object.values(zone)[0]
        const answerIndex = answersArray.indexOf(answer)
        const answerLetter = personalityAnswers[questionNumber][answerIndex][0]
        const answerPoints = personalityAnswers[questionNumber][answerIndex][1]
        result[answerLetter] += answerPoints
      }
      let finalResult = { mind: {}, energy: {}, nature: {}, tactics: {} }
      if (result.e > result.i) {
        const personalityData = await PersonalityData.findOne({ letter: 'E' })
        finalResult.mind = personalityData._id
      } else {
        const personalityData = await PersonalityData.findOne({ letter: 'I' })
        finalResult.mind = personalityData._id
      }

      if (result.s > result.n) {
        const personalityData = await PersonalityData.findOne({ letter: 'S' })
        finalResult.energy = personalityData._id
      } else {
        const personalityData = await PersonalityData.findOne({ letter: 'N' })
        finalResult.energy = personalityData._id
      }

      if (result.t > result.f) {
        const personalityData = await PersonalityData.findOne({ letter: 'T' })
        finalResult.nature = personalityData._id
      } else if (result.f > result.t) {
        const personalityData = await PersonalityData.findOne({ letter: 'F' })
        finalResult.nature = personalityData._id
      } else {
        if (req.user.gender === 'male') {
          const personalityData = await PersonalityData.findOne({ letter: 'T' })
          finalResult.nature = personalityData._id
        } else {
          const personalityData = await PersonalityData.findOne({ letter: 'F' })
          finalResult.nature = personalityData._id
        }
      }

      if (result.j > result.p) {
        const personalityData = await PersonalityData.findOne({ letter: 'J' })
        finalResult.tactics = personalityData._id
      } else {
        const personalityData = await PersonalityData.findOne({ letter: 'P' })
        finalResult.tactics = personalityData._id
      }

      const responseResult = await Personality.create({ ...finalResult })
      await User.updateOne(
        { _id: req.user._id },
        { personality: responseResult._id }
      )
      return res.status(200).json({ data: 'Personality updated successfully' })
    } catch (err) {
      next(err)
    }
  },
  getPersonalityTest: async (req, res, next) => {
    try {
      const personality = await Personality.findOne({
        _id: req.user.personality,
      }).populate(['mind', 'energy', 'nature', 'tactics'])
      return res.status(200).json({ data: personality })
    } catch (err) {
      next(err)
    }
  },
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findOne(
        { _id: req.user.id },
        '-password -createdAt -emailVerifiedAt -__v -validateToken -_id -updatedAt'
      )
      const notifications = await Notification.find({
        madeTo: req.user._id,
        viewed: false,
      })
      return res
        .status(200)
        .json({ data: user, notificationCount: notifications?.length })
    } catch (err) {
      next(err)
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const { name, dob } = req.body
      await User.updateOne({ _id: req.user._id }, { name, dob })
      return res.status(200).json({ message: 'Updated successfully' })
    } catch (err) {
      next(err)
    }
  },
  pdfRead: async (req, res, next) => {
    try {
      const { file } = req.files
      const skillDataSet = require('../helpers/data/skillsDataSet')
      if (file.type !== 'application/pdf')
        return res.status(400).json({
          message: `application/pdf type is accepted only, received ${file.type}`,
        })
      const resume = new ResumeParser(file.path)
      let jsonData = await resume
        .parseToJSON()
        .then((res) => res.parts)
        .catch((err) => {
          throw err
        })

      const matchedSkills = []
      if (Boolean(jsonData?.skills)) {
        let skills = jsonData.skills.replace(/[;,.:]/g, ' ').split(' ')
        for (let k = 0; k < skills.length; k++) {
          const word = skills[k]
          for (let i = 0; i < skillDataSet.length; i++) {
            const zone = skillDataSet[i]
            for (let j = 0; j < zone.name.length; j++) {
              const skillWord = zone.name[j]
              if (word.toLowerCase() === skillWord.toLowerCase()) {
                matchedSkills.push(zone?.name[0])
                break
              }
            }
          }
        }
      }
      const { name, languages, interests, education, ...data } = jsonData
      return res.status(200).json({ data: { ...data, skills: matchedSkills } })
      // const pdfText = await pdf(dataBuffer)
      // let result = {}
      // let constants = [
      //   {
      //     title: 'dob',
      //     words: ['dob', 'birth', 'date'],
      //     countMatters: false,
      //     verifiers: [
      //       { type: 'exact', conditionValues: false, arr: ['dob'] },
      //       { type: 'exact', conditionValues: true, arr: ['date', 'birth'] },
      //     ],
      //   },
      //   {
      //     title: 'seniorityLevel',
      //     words: [
      //       'junior',
      //       'mid-senior',
      //       'mid',
      //       'senior',
      //       'entry-level',
      //       'entry',
      //       'level',
      //     ],
      //     countMatters: true,
      //     verifiers: [
      //       { type: 'exact', conditionValues: true, arr: ['junior'] },
      //       { type: 'exact', conditionValues: false, arr: ['mid', 'senior'] },
      //       { type: 'exact', conditionValues: true, arr: ['mid-senior'] },
      //       { type: 'exact', conditionValues: true, arr: ['entry-level'] },
      //       { type: 'exact', conditionValues: true, arr: ['entry', 'level'] },
      //     ],
      //   },
      // ]
      // let pdfTextArray = pdfText.text.split('\n')
      // for (let i = 0; i < pdfTextArray.length; i++) {
      //   let exist = false
      //   const zone = pdfTextArray[i].replace(/[;,.:]/g, ' ').split(' ')

      //   for (let j = 0; j < zone.length; j++) {
      //     const word = zone[j]
      //     for (let k = 0; k < constants.length; k++) {
      //       if (constants[k].words.includes(word.toLowerCase())) {
      //         result[constants[k].title]
      //           ? result[constants[k].title].push(zone)
      //           : (result[constants[k].title] = [zone])
      //         exist = true
      //         break
      //       }
      //     }
      //     if (exist) {
      //       break
      //     }
      //   }
      // }
      // for (const key in result) {
      //   if (Object.hasOwnProperty.call(result, key)) {
      //     const value = result[key]
      //     if (key === 'skills') {
      //       continue
      //     }
      //     for (let i = 0; i < value.length; i++) {
      //       const possibleMatch = value[i]
      //       let match = false
      //       let count = 0
      //       for (let j = 0; j < constants[key].verifiers.length; j++) {
      //         const verifier = constants[key].verifiers[j]
      //       }
      //       constants[key].verifiers
      //       if (match) break
      //     }
      //   }
      // }
      // pdfText.text
      //   .replace(/[;,.:]/g, ' ')
      //   .split(' ')
      //   .map((word) => {
      //     for (let i = 0; i < skillDataSet.length; i++) {
      //       const zone = skillDataSet[i]
      //       for (let i = 0; i < zone.name.length; i++) {
      //         const skillWord = zone.name[i]
      //         if (word.toLowerCase() === skillWord.toLowerCase()) {
      //           result.skills
      //             ? result.skills.push(word)
      //             : (result.skills = [word])
      //         }
      //       }
      //     }
      //   })
      // return res.status(200).json({ data: result, text: pdfTextArray })
    } catch (err) {
      next(err)
    }
  },
  getRandomSkillTest: async (req, res, next) => {
    try {
      const { language, level } = req.params
      const tests = await Test.find({ language, level })
      if (tests?.length < 1)
        return res
          .status(400)
          .json({ message: `No ${language} tests on level ${level}` })
      let numberOfTests = tests?.length
      let randomNumber = Math.floor(Math.random() * numberOfTests)
      return res.status(200).json({ data: tests[randomNumber]._id })
    } catch (err) {
      next(err)
    }
  },
  takeSkillTest: async (req, res, next) => {
    try {
      const RunnerManager = require('../helpers/runners/RunnerManager')
      const { code, lang } = req.body
      const { testId } = req.params
      const test = await Test.findOne({ _id: testId })
      if (!test) return res.status(404).json({ message: 'Test not found' })
      console.log(`lang: ${lang}`, `code:${code}`)
      RunnerManager.run(lang, code, test, req, res)
    } catch (err) {
      next(err)
    }
  },
  getSkillTest: async (req, res, next) => {
    try {
      const { testId } = req.params
      const test = await Test.findOne({ _id: testId })
      if (!test) return res.status(404).json({ message: 'Test not found' })
      return res.status(200).json({ data: test })
    } catch (err) {
      next(err)
    }
  },
  getUserSkills: async (req, res, next) => {
    try {
      const skills = await Skill.findOne({ _id: req.user.skills })
      return res.status(200).json({ data: skills })
    } catch (err) {
      next(err)
    }
  },
  extraInformation: async (req, res, next) => {
    try {
      const extraInfo = await ExtraInfo.findOne({ _id: req.user.extraInfo })
      if (extraInfo) {
        await ExtraInfo.updateOne({ _id: extraInfo._id }, req.body)
      } else {
        const extraInfo = await ExtraInfo.create(req.body)
        await User.updateOne({ _id: req.user._id }, { extraInfo })
      }
      return res.status(200).json({ message: 'Updated Successfully' })
    } catch (err) {
      next(err)
    }
  },
  getExtraInformation: async (req, res, next) => {
    try {
      const extraInfo = await ExtraInfo.findOne({ _id: req.user.extraInfo })
      return res.status(200).json({ data: extraInfo })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const { month = moment().format('MM/YYYY') } = req.query
      const skills = await Skill.findOne({ _id: req.user.skills })
      const personality = await Personality.findOne({
        _id: req.user.personality,
      }).populate(['mind', 'energy', 'nature', 'tactics'])
      const extraInfo = await ExtraInfo.findOne({ _id: req.user.extraInfo })
      const meetings = await Meeting.find(
        {
          madeTo: req.user._id,
          date: {
            $gte: moment(month, 'MM/YYYY')
              .startOf('month')
              .startOf('day')
              .format('YYYY-MM-DD'),
            $lte: moment(month, 'MM/YYYY')
              .endOf('month')
              .endOf('day')
              .format('YYYY-MM-DD'),
          },
        },
        '-madeTo -name'
      ).populate([
        { path: 'madeBy', select: 'name' },
        { path: 'search', select: '-result -madeBy' },
      ])
      const response = {
        skills,
        personality,
        calendar: meetings,
      }
      if (extraInfo) {
        response.extraInfo = extraInfo.updatedAt
      } else {
        response.extraInfo = null
      }
      return res.status(200).json({ data: response })
    } catch (err) {
      next(err)
    }
  },
  getPending: async (req, res, next) => {
    try {
      const meetings = await Meeting.find(
        { madeTo: req.user._id, status: 0 },
        '-madeTo -name'
      )
        .sort({ updatedAt: -1 })
        .populate('search', '-result')
        .populate('madeBy', 'name')
      return res.status(200).json({ data: meetings })
    } catch (err) {
      next(err)
    }
  },
  getNotification: async (req, res, next) => {
    try {
      const notifications = await Notification.find({
        madeTo: req.user._id,
      })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate({
          path: 'meeting',
          select: { madeBy: 0, madeTo: 0 },
          populate: { path: 'search', select: { result: 0 } },
        })
        .populate('madeBy', 'name')
      await Notification.updateMany(
        {
          _id: { $in: notifications.map((zone) => zone?._id) },
        },
        {
          viewed: true,
        }
      )
      const result = notifications.map((zone) => {
        let message
        switch (zone.type) {
          case 'Request':
            message = `${zone.madeBy.name} has request a meeting!`
            break

          case 'Accept':
            message = `${zone.madeBy.name} has accepted your request!`
            break

          case 'Decline':
            message = `${zone.madeBy.name} has declined your request!`
            break

          case 'Update':
            message = `${zone.madeBy.name} has requested another time for the meeting!`
            break

          default:
            break
        }
        return {
          message,
          details: zone,
        }
      })
      return res.status(200).json({ data: result })
    } catch (err) {
      next(err)
    }
  },
  readNotification: async (req, res, next) => {
    try {
      const { ids } = req.body
      await Notification.updateMany({ _id: { $in: ids } }, { viewed: true })
      return res.status(200).json({ message: 'Updated successfully' })
    } catch (err) {
      next(err)
    }
  },
  respondToRequest: async (req, res, next) => {
    try {
      const { response, meetingId, date, time, message } = req.body
      const meeting = await Meeting.findOne({ _id: meetingId })
      if (!meeting)
        return res.status(404).json({ message: 'Meeting not found' })
      if (response === 'Accept') {
        await Meeting.updateOne(
          { _id: meetingId },
          { $push: { message: message }, status: 1 }
        )
        await Notification.create({
          madeTo: meeting.madeBy,
          meeting: meetingId,
          madeBy: req.user._id,
          type: 'Accept',
          viewed: false,
        })
      } else if (response === 'Decline') {
        await Meeting.updateOne(
          { _id: meetingId },
          { $push: { message: message }, status: -1 }
        )
        await Notification.create({
          madeTo: meeting.madeBy,
          meeting: meetingId,
          madeBy: req.user._id,
          type: 'Decline',
          viewed: false,
        })
      } else {
        await Meeting.updateOne(
          { _id: meetingId },
          { date, time, status: 2, $push: { message: message } }
        )
        await Notification.create({
          madeTo: meeting.madeBy,
          meeting: meetingId,
          madeBy: req.user._id,
          type: 'Update',
          viewed: false,
        })
      }
      return res.status(200).json({ message: 'Updated successfully' })
    } catch (err) {
      next(err)
    }
  },
}
