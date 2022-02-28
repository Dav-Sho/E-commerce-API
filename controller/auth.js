const crypto = require('crypto')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../model/User')
const sendEmail = require('../utils/sendEmail')

const register = asyncHandler( async(req, res, next) => {
    const {name, email, password, role} = req.body

    let user = await User.findOne({email})

    // Check if user already have account
    if(user) {
        return next(new ErrorResponse('User already exist', 400))
    }

    // create User
    user = await User.create({
        name,
        email,
        password,
        role
    })

    // Send cookie
    sendCookie(user, 200, res)
})

const login = asyncHandler( async(req, res, next) => {
    const {email, password} = req.body

    if(!email || !password) {
        return next(new ErrorResponse('Please add email and password'))
    }

    const user = await User.findOne({email}).select('+password')

    // Check User
    if(!user) {
        return next(new ErrorResponse('Inavlid Credential', 400))
    }

    const isMatch = await user.matchPassword(password)

    // Match Password
    if(!isMatch) {
        return next(new ErrorResponse('Inavlid Credential', 400))
    }

    // Send cookie
    sendCookie(user, 200, res)
})

const logout = asyncHandler( async(req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    }).json({
        success: true,
        msg: 'Logout User'
    })
})

const forgot = asyncHandler( async(req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if(!user) {
        return next(new ErrorResponse('User with the email not found'))
    }

    const resToken  = user.getResetToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resettoken/${resToken}`

    const message = `You are receiving this message because you or someone else has requested the reset password: please make a put request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message
        })

        res.status(200).json({
            success: true,
            data: 'Email Send'
        })
    } catch (err) {
        console.error(err.message)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})
        return next(new ErrorResponse('Email not send', 400))
    }
})

const resetPassword = asyncHandler( async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user) {
        return next(new ErrorResponse('Invalid token', 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined,
    user.resetPasswordExpire = undefined
    await user.save({validateBeforeSave: false})

    sendCookie(user, 200, res)
})

const getMe = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

const sendCookie = (user, statusCode, res) => {

    const token = user.getSignJsonToken()
    
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 100),
        httpOnly: true
    }

    res.status(200).cookie('tokens', token, options).json({
        success: true,
         token
    })
}

module.exports = {
    register,
    login,
    logout,
    forgot,
    resetPassword,
    getMe
}