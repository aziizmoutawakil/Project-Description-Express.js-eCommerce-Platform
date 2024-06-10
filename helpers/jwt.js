require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '60d' });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
