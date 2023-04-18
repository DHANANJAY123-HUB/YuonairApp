const mongoose = require('mongoose')
mongoose.set('strictQuery',true);
const url = "mongodb://localhost:27017/Yuonair"
mongoose.connect(url)
const db = mongoose.connection
console.log("Successfully connected to mongodb database")
module.exports = db