const ErrorResponse = require('../utils/ErrorResponse')
const errorHandler = (err, req, res, next) => {
    let error = {...err}

    error.message = err.message

    console.log(err);

    if(err.name === 'CastError') {
        const message = `Resource not found with the id ${err.value}`
        error = new ErrorResponse(message, 404)
    }

    if(err.code === 11000) {
        const message = 'Duplicate key entered'
        error = new ErrorResponse(message, 400)
    }

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(err.statusCode || 500).json({
        successs: false,
        error: error.message
    })
}

module.exports = errorHandler