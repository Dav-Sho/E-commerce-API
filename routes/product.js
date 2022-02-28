const express = require('express')
const {getProducts, getProduct, addProduct, updateProduct, deleteProduct, uplaodPhoto} = require('../controller/product')
const router = express.Router()
const {protect, authorize} = require('../middleware/auth')
const reveiwRoute = require('./review')

router.use('/:productId/review', reveiwRoute)
router.route('/').get(getProducts).post(protect, authorize('admin'), addProduct)
router.route('/:id').get(getProduct).patch(protect, authorize('admin'), updateProduct).delete(protect, authorize('admin'), deleteProduct)
router.route('/uploadPhoto/:id').patch(protect, authorize('admin'), uplaodPhoto)
module.exports = router