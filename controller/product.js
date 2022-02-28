const path = require('path')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorRespose = require('../utils/ErrorResponse')
const Product = require('../model/Product')
 

const getProducts = asyncHandler( async(req, res, next) => {
    const products = await Product.find().populate({
        path: 'reviews',
        select: 'rating title text'
    })

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    })
})

const getProduct = asyncHandler( async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorRespose(`Product not found with the id ${req.params.id}` ))
    }

    res.status(200).json({
        success: true,
        data: product
    })
})

const addProduct = asyncHandler( async(req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        data: product
    })
})

const updateProduct = asyncHandler( async(req, res, next) => {

    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorRespose(`Product not found with the id ${req.params.id}` ))
    }

    if(product.user.toString() !== req.user.id) {
        return next(new ErrorRespose('User not authorized to update this route', 401))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: product
    })
})

const deleteProduct = asyncHandler( async(req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorRespose(`Product not found with the id ${req.params.id}` ))
    }

    if(product.user.toString() !== req.user.id) {
        return next(new ErrorRespose('User not authorized to update this route', 401))
    }

    product.remove()

    res.status(200).json({
        success: true,
        data: {}
    })
})

const uplaodPhoto = asyncHandler( async(req, res, next) => {
    let product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorRespose(`Product not found with the id ${req.params.id}` ))
    }

    if(product.user.toString() !== req.user.id) {
        return next(new ErrorRespose('User not authorized to update this route', 401))
    }

    // check file
    if(!req.files) {
        return next(new ErrorRespose('Please Upload a file', 400))
    }

    console.log(req.files);

    const file = req.files.file

    // check image
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorRespose('Please upload image', 400))
    }

    // check size
    if(file.size > process.env.FILE_SIZE) {
        return next(new ErrorRespose(`Please upload image less than ${process.env.FILE_SIZE}`, 400))
    }

    file.name = `photo_${product._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err.message)
            return next(new ErrorRespose('Problem in uploading photo', 5000))
        }

        await Product.findByIdAndUpdate(req.params.id, {image: file.name})

        res.status(200).json({
            success: true,
            data: file.name
        })
    })

    console.log(file.name)
})

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    uplaodPhoto
}


