const express = require('express')
const {getReviews, getReview, addReview, updateReview, deleteReview} = require('../controller/review')
const router = express.Router({mergeParams: true})
const {protect} = require('../middleware/auth')

router.route('/').get(getReviews).post(protect, addReview)
router.route('/:id').get(getReview).patch(protect, updateReview).delete(protect, deleteReview)

module.exports = router