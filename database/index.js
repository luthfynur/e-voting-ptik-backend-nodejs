const mongoose = require('mongoose')
const { dbHost, dbPort, dbName, dbUser, dbPass } = require('../app/config')

mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,
  //`mongodb+srv://luthfy:${dbPass}@cluster0.ay8xq.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

const db = mongoose.connection

module.exports = db
