const jwt = require('jsonwebtoken');
const productSchema = require('../models/product.Schema');

exports.isProductOwner = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header provided' });
        }

        const tokenArray = authHeader.split(' ');
        if (tokenArray.length !== 2 || tokenArray[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Malformed authorization header' });
        }

        const token = tokenArray[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = decoded.userId;
        const productId = req.params.id;

        const product = await productSchema.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (product.owner.toString() !== userId) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
        console.error('Error checking product ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
