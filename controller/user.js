const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../model/User')

const getUsers = asyncHandler( async(req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    })
})

const getUser = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

const addUser = asyncHandler( async(req, res, next) => {
    const user = await User.create(req.body)

    res.status(200).json({
        success: true,
        data: user
    })
})

const updateUser = asyncHandler( async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

const deleteUser = asyncHandler( async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        msg: 'User deleted'
    })
})

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser  
}