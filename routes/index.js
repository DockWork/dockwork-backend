module.exports = (app) => {
	const testRoutes = require('./test.routes')
	app.use('/test', testRoutes)

	const authRoutes = require('./auth.routes')
	app.use('/auth', authRoutes)

	const jobSeekerRoutes = require('./jobSeeker.routes')
	app.use('/jobseeker', jobSeekerRoutes)

	const companyRoutes = require('./company.routes')
	app.use('/company', companyRoutes)
}
