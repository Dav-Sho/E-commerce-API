const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const protect = asyncHandler( async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }

    if(!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE)
        console.log(decoded);
        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        console.error(err)
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

   
})

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with the role ${req.user.role} not authorized to access this route`, 401))
        }
        next()
    }
}

module.exports = {
    protect,
    authorize
}