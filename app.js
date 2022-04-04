require('dotenv').config()
const express = require('express')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)

const connectDB = require('./config/database.config')

// DATABASE CONNECTION
connectDB()

// Configs
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('short'))
app.use(cors())

// Static Route
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'dist')))

// Health Check
app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
	// res.status(200).json({
	// 	message:
	// 		"Welcome to Elias Lichaa el Khoury and Mickel el Khoury's senior project",
	// })
})

// Socket Server
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	socket.emit('me', socket.id)

	socket.on('disconnect', () => {
		socket.broadcast.emit('callEnded')
	})

	socket.on('callUser', ({userToCall, signalData, from, name}) => {
		io.to(userToCall).emit('callUser', {signal: signalData, from, name})
	})

	socket.on('answerCall', (data) => {
		io.to(data.to).emit('callAccepted', data.signal)
	})
})

// Routes
require('./routes')(app)

// Error handler
const errorCatcher = require('./middlewares/errorCatcher.middleware')
app.use(errorCatcher)

// Initializing app
const port = process.env.APP_PORT || 9900
const appServer = app.listen(port, () => {
	console.log(`Server started on ${port}`)
})
