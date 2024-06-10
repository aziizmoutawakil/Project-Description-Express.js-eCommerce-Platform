const jwt = require('jsonwebtoken');
require('dotenv').config();
const { verifyToken } = require('../helpers/jwt');

const Auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        console.log('No authorization header');
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('No token found after splitting header');
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
        console.log('Token received:', token); // Debug log for the token
        const decoded = verifyToken(token); // Use the helper function to verify the token
        console.log('Decoded token:', decoded); // Debug log for the decoded token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debug log for the error
        res.status(400).send('Invalid Token');
    }
};

module.exports = Auth;
