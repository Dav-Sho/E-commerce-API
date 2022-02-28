const asyncHandler = require('../middleware/asyncHandler')
const ErrorRespose = require('../utils/ErrorResponse')
const Product = require('../model/Product')
const Review = require('../model/Review')

const getReviews = asyncHandler( async(req, res, next) => {
    const reviews = await Review.find().populate({
        path: 'product',
        select: 'name company price'
    })

    if(!reviews) {
        return next(new ErrorRespose('No reviews', 400))
    }

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    })
})

const getReview = asyncHandler( async(req, res, next) => {
    const review = await Review.findById(req.params.id)

    if(!review) {
        return next(new ErrorRespose(`Review not found with the id ${req.params.id} found`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

// routes   Post/api/v1/product/:productId/review
// @access  Privare
// desc     Add review
const addReview = asyncHandler( async(req, res, next) => {
    req.body.product = req.params.productId
    req.body.user = req.user.id

    const product = await Product.findById(req.params.productId)

    if(!product) {
        return next(new ErrorRespose(`Product not found with the id ${req.params.productId}`,404))
    }

    // check if already sumbmitted
    const sumbmitted = await Review.findOne({
        product: req.params.productId,
        user: req.user.id
    })

    if(sumbmitted) {
        return next(new ErrorRespose(`User with the id ${req.user.id} already create review`,400))
    }

    const review =  await Review.create(req.body)

    res.status(200).json({
        success: true,
        data: review
    })
})

const updateReview = asyncHandler( async(req, res, next) => {
    let review = await Review.findById(req.params.id)

    if(!review) {
        return next(new ErrorRespose(`Review not found with the id ${req.params.id} found`, 404))
    }

    if(review.user.toString() !== req.user.id) {
        return next(new ErrorRespose(`User with the id ${req.user.id} not authorized to access this route`, 401))
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: review
    })
})

const deleteReview = asyncHandler( async(req, res, next) => {
    let review = await Review.findById(req.params.id)

    if(!review) {
        return next(new ErrorRespose(`Review not found with the id ${req.params.id} found`, 404))
    }

    if(review.user.toString() !== req.user.id) {
        return next(new ErrorRespose(`User with the id ${req.user.id} not authorized to access this route`, 401))
    }

    review = await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        data: 'Review deleted'
    })
})

module.exports = {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
}

