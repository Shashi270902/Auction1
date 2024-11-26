const mongoose = require('mongoose')
require('dotenv').config()
const main = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database Connected')
    } catch (error) {
        console.log(error)
    }
}
module.exports = main;
