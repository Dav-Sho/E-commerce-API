const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: String,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    title: {
        type: String,
        required: [true, 'Please provide rating title'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please provide review text' ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

ReviewSchema.statics.getAverageRating = async function(productId) {
    const obj = await this.aggregate([
        {
            $match: {product: productId}
        },
        {
            $group: {
                _id: '$product',
                averageRating: {$avg: '$rating'}
            }
        }
    ])

    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            averageRating: obj[0].averageRating
        })
    } catch (err) {
        console.error(err.message)
    }
}

ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.product)
})

ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)