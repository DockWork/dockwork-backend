const mongoose = require('mongoose')

const dbUri = process.env.DB_URI

const connectDB = () => {
  mongoose
    .connect(dbUri)
    .then((con) =>
      console.log(
        `MONGODB DATABASE CONNECTED WITH HOST: ${con.connection.host}`
      )
    )
    .catch((error) => console.error('ERROR:', error))
}

module.exports = connectDB
