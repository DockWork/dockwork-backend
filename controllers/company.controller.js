const User = require('../models/user.model')
const ExtraInfo = require('../models/extraInfo.model')
const Search = require('../models/search.model')
const Meeting = require('../models/meeting.model')
const Notification = require('../models/notification.model')
const moment = require('moment')
const {sendEmail} = require('../config/mail.config')

module.exports = {
	getProfile: async (req, res, next) => {
		try {
			const user = await User.findOne(
				{_id: req.user.id},
				'-password -createdAt -emailVerifiedAt -__v -validateToken -_id -updatedAt',
			)
			const notifications = await Notification.find({
				madeTo: req.user._id,
				viewed: false,
			})
			return res
				.status(200)
				.json({data: user, notificationCount: notifications?.length})
		} catch (err) {
			next(err)
		}
	},
	editProfile: async (req, res, next) => {
		try {
			const {name, dob} = req.body
			await User.updateOne({_id: req.user._id}, {name, dob})
			return res.status(200).json({message: 'Updated successfully'})
		} catch (err) {
			next(err)
		}
	},
	advancedSearch: async (req, res, next) => {
		try {
			// Phase 1:Elimination
			// remote and location would directly eliminate the jobseeker
			// Salary if expected < maximum+5% of the average we take consider, otherwise direct elimination
			// Eliminate users on the role of the job
			// Phase 2:Weighting
			// give weights for each user, (Skill+PreferedBadge)-Salary
			// 100pts
			// Skill + Prefered Badge (x points)
			// Salary (y points => 100-x)
			// Skills:
			// x1 = List of skills required = number
			// y1 = List of skills available that are matched with the required = number
			// points calculation y1/x1 % => converted to Skill points
			// Badges:
			// x2 = List of required badges = number
			// y2 = List of badges completed that match the required = number
			// points calculation y2/x2 % => converted to Badge points
			// Salary:
			// total = total of salaries
			// 1$ in points =>
			// Salary is going to take the other pts
			// Phase 3: Sorting & limiting
			// We sort the users depeding on the weights provided
			// and we limit the search on 10
			let salaryBalance = 45
			let badgeBalance = 10
			let skillBalance = 45
			const {
				name,
				location,
				remote,
				role,
				skills,
				preferedBadge,
				minimumSalary,
				maximumSalary,
			} = req.body
			let result = []
			let parameters = {}
			if (!remote) {
				parameters.location = {$or: [{location}, {relocate: true}]}
			}
			const averageSalary = (minimumSalary + maximumSalary) / 2
			const averageSalaryPercentage = averageSalary * 0.05
			parameters.expectedSalary = maximumSalary + averageSalaryPercentage
			if (role === 'frontEnd') {
				parameters.roles = ['frontEnd', 'fullStack']
			} else if (role === 'backEnd') {
				parameters.roles = ['backEnd', 'fullStack']
			} else {
				parameters.roles = [role]
			}
			const extraInfos = await ExtraInfo.find({
				...parameters.location,
				expectedSalary: {$lt: parameters.expectedSalary},
				roles: {$in: parameters.roles},
				activeForWork: true,
			})
			if (extraInfos.length < 1) {
				return res.status(200).json({data: ''})
			}
			const users = await User.find(
				{
					extraInfo: {$in: [...extraInfos.map((zone) => zone._id)]},
				},
				'-password -createdAt -emailVerifiedAt -__v -validateToken -updatedAt',
			).populate(['skills', 'extraInfo'])
			let totalSalaries = 0
			let numberOfSkillsRequired = skills.length
			let numberOfBadgesRequired = preferedBadge.length
			for (let i = 0; i < users.length; i++) {
				const zone = users[i]
				totalSalaries += zone.extraInfo.expectedSalary
				let numberOfSkillsMatched = 0
				let numberOfBadgesMatched = 0
				for (let j = 0; j < zone.extraInfo.skills.length; j++) {
					const element = zone.extraInfo.skills[j]
					if (skills.includes(element)) {
						numberOfSkillsMatched++
					}
				}
				if (numberOfSkillsMatched === 0) {
					continue
				}
				for (let j = 0; j < preferedBadge.length; j++) {
					const badge = preferedBadge[j]
					if (Object.prototype.hasOwnProperty(zone.skills || {}, badge.name)) {
						if (zone.skills[badge.name] >= badge.level) {
							numberOfBadgesMatched++
						}
					}
				}
				let skillsWeight =
					(numberOfBadgesRequired
						? (numberOfBadgesMatched / numberOfBadgesRequired) * badgeBalance
						: 0) +
					(numberOfSkillsMatched / numberOfSkillsRequired) * skillBalance

				result.push({
					weight: skillsWeight,
					user: zone,
				})
			}
			let dollarInPoints = salaryBalance / totalSalaries
			for (let i = 0; i < result.length; i++) {
				const zone = result[i]
				zone.weight +=
					salaryBalance - zone.user.extraInfo.expectedSalary * dollarInPoints
			}
			result.sort((a, b) => {
				return b.weight - a.weight
			})
			result = result.slice(0, 10)
			const search = await Search.create({
				name,
				location,
				remote,
				role,
				skills,
				preferedBadge,
				minimumSalary,
				maximumSalary,
				result,
				madeBy: req.user._id,
			})
			return res.status(200).json({data: search._id})
		} catch (err) {
			next(err)
		}
	},
	getSearchResult: async (req, res, next) => {
		try {
			const {searchId} = req.params
			const search = await Search.findOne({_id: searchId})
				.populate([
					{
						path: 'result',
						populate: [
							{
								path: 'user',
								select:
									'-password -createdAt -emailVerifiedAt -__v -validateToken -updatedAt -name',
								populate: [
									{path: 'extraInfo skills'},
									{
										path: 'personality',
										populate: {path: 'mind nature energy tactics'},
									},
								],
							},
						],
					},
				])
				.populate('madeBy')
			if (!search) return res.status(404).json({message: 'Result not found'})
			if (JSON.stringify(search.madeBy._id) !== JSON.stringify(req.user._id))
				return res
					.status(400)
					.json({message: 'You cannot access this search result'})

			return res.status(200).json({data: search})
		} catch (err) {
			next(err)
		}
	},
	getDashboard: async (req, res, next) => {
		try {
			const {month = moment().format('MM/YYYY')} = req.query
			// Search History last 5
			const searches = await Search.find(
				{madeBy: req.user._id},
				'name createdAt',
			)
				.sort({
					createdAt: -1,
				})
				.limit(5)

			// meetings with status
			const meetings = await Meeting.find(
				{
					madeBy: req.user._id,
					// date: { $gt: moment().startOf('day').format('YYYY-MM-DD') },
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
				'-madeBy -madeTo',
			).populate([{path: 'search', select: '-result -madeBy'}])
			return res
				.status(200)
				.json({data: {history: searches, calendar: meetings}})
		} catch (err) {
			next(err)
		}
	},
	requestMeeting: async (req, res, next) => {
		try {
			const {madeTo, message, date, time, name, link, search} = req.body
			const user = await User.findOne({_id: madeTo}, 'email name ')
			const meeting = await Meeting.create({
				madeTo,
				date,
				time,
				link,
				search,
				name,
				message: [message],
				status: 0,
				madeBy: req.user._id,
			})
			await sendEmail({
				email: user.email,
				subject: 'New Meeting Request',
				message: `Dear ${user.name}, you have received a new meeting request please follow this link to respond ${process.env.FRONT_END_URL}/js/notification/2`,
			})

			await Notification.create({
				madeTo,
				meeting: meeting._id,
				madeBy: req.user._id,
				type: 'Request',
				viewed: false,
			})
			return res.status(200).json({message: `Meeting request sent`})
		} catch (err) {
			next(err)
		}
	},
	respondToRequest: async (req, res, next) => {
		try {
			const {response, meetingId, date, time, message} = req.body
			const meeting = await Meeting.findOne({_id: meetingId})
			if (!meeting) return res.status(404).json({message: 'Meeting not found'})
			if (response === 'Accept') {
				await Meeting.updateOne({_id: meetingId}, {message, status: 1})
				await Notification.create({
					madeTo: meeting.madeTo,
					meeting: meetingId,
					madeBy: req.user._id,
					type: 'Accept',
					viewed: false,
				})
			} else if (response === 'Decline') {
				await Meeting.updateOne({_id: meetingId}, {message, status: -1})
				await Notification.create({
					madeTo: meeting.madeTo,
					meeting: meetingId,
					madeBy: req.user._id,
					type: 'Decline',
					viewed: false,
				})
			} else {
				await Meeting.updateOne(
					{_id: meetingId},
					{date, time, status: 0, $push: {message: message}},
				)
				await Notification.create({
					madeTo: meeting.madeTo,
					meeting: meetingId,
					madeBy: req.user._id,
					type: 'Update',
					viewed: false,
				})
			}
			return res.status(200).json({message: 'Updated successfully'})
		} catch (err) {
			next(err)
		}
	},
	getNotifications: async (req, res, next) => {
		try {
			const notifications = await Notification.find({
				madeTo: req.user._id,
			})
				.sort({createdAt: -1})
				.limit(30)
				.populate({
					path: 'meeting',
					select: {madeBy: 0, madeTo: 0},
					populate: {path: 'search', select: {result: 0}},
				})
				.populate('madeBy', 'name')

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
			return res.status(200).json({data: result})
		} catch (err) {
			next(err)
		}
	},
	getPending: async (req, res, next) => {
		try {
			const meetings = await Meeting.find(
				{madeBy: req.user._id, status: 2},
				'-madeTo',
			)
				.sort({updatedAt: -1})
				.populate('search', '-result')
				.populate('madeBy', 'name')
			return res.status(200).json({data: meetings})
		} catch (err) {
			next(err)
		}
	},
	readNotification: async (req, res, next) => {
		try {
			const {ids} = req.body
			await Notification.updateMany({_id: {$in: ids}}, {viewed: true})
			return res.status(200).json({message: 'Updated successfully'})
		} catch (err) {
			next(err)
		}
	},
}
