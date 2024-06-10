const mongoose = require('mongoose')

const product = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        
    },
    price: {
        type: Number,
        required: true
    },
    categorie: {
        type: String,
        required: true

    },
    image: {
        type: String,

    },
    owner: {
        type: String,
    },

    stock: {
        type: Number,
    },
    published: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


    genre: [String]
}, { versionKey: false, timestamps: true })

module.exports = mongoose.model('products', product)