const errorCatcher = (err, _, res, next) => {
	if (err) {
		console.log(err.stack)
		return res.status(500).json({message: err.message, error: err.stack})
	} else {
		return
	}
}

module.exports = errorCatcher
