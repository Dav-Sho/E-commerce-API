const express = require('express')
const {register, login, logout, forgot, resetPassword, getMe} = require('../controller/auth')
const router = express.Router()
const {protect} = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgot').post(forgot)
router.route('/resettoken/:resettoken').patch(resetPassword)
router.route('/me').get(protect, getMe)

module.exports = router