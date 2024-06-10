const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    age: { type: Number,  },
    userid: { type: String, },
    Country: { type: String, },
    sex: { type: String,  },
    phoneNumber: { type: Number, },
    lastLogin: { type: Date, required: false, Default: Date.now },
    createdAt: { type: Date, required: false, Default: Date.now },
}, { timestamps: true }); // Add timestamps option to automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
