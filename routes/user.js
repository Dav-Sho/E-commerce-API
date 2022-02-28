const express = require('express')
const {getUsers, getUser, addUser, updateUser, deleteUser} = require('../controller/user')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router()

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(getUsers).post(addUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
