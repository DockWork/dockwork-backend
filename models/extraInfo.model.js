const mongoose = require('mongoose')
const {Schema, model} = mongoose

const extraInfoSchema = new Schema(
	{
		relocate: {type: Boolean, required: true},
		activeForWork: {type: Boolean, required: true},
		location: {type: String, required: true},
		roles: [{type: String, required: true}],
		typeOfWork: {type: String, required: true},
		skills: [{type: String, required: true}],
		expectedSalary: {type: Number, required: true},
		experience: [
			{
				employerName: {type: String, required: true},
				title: {type: String, required: true},
				location: {type: String},
				workHere: {type: Boolean, required: true},
				startDate: {type: Date, required: true},
				endDate: {type: Date},
				summary: {type: String},
			},
		],
	},
	{
		timestamps: true,
	},
)

const ExtraInfoModel = model('ExtraInfo', extraInfoSchema)
module.exports = ExtraInfoModel
