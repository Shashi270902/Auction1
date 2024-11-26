const express = require('express')
const { createUser } = require('../controllers/user.registerController')
// const uploadPic = require('../middlewares/user.uploadprofile')
const registerRouter = express.Router()




console.log('signup router')
registerRouter.post('/', createUser)




module.exports = registerRouter 
