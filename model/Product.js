const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        maxlength: [50, 'Product name can not be more than 50 characters'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [1000, 'Product description can nit be more than 1000 characters']
    },
    image: {
        type: String,
        default: 'photo.jpeg'
    },
    category: {
        type: String,
        enum: ['office', 'kitchen', 'bedroom'],
        required: [true, 'Please provide product category']
    },
    company: {
        type: String,
        enum: ['ikea', 'liddy', 'marcos'],
        required: [true, 'Please add product company']
    },
    colors: {
        type: [String],
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    freeShiping: {
        type: Boolean,
        default: false
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

// Delete review when Product is deleted
ProductSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({product: this._id})
    next()
})

module.exports = mongoose.model('Product', ProductSchema)