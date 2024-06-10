const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Auth = require('../middleware/isAuthenticated');
const { isProductOwner } = require('../middleware/isOwner');

const { 
    ShowMyProduncts, 
    GetAllProductBy, 
    AddProduct, 
    GetProductByCategorie, 
    GetProductById, 
    UpdateProductById, 
    DeletProductById 
} = require('../controllers/product');
router.post('/api/product/addproduct', Auth, upload, AddProduct);
router.get('/api/product', GetAllProductBy);
router.get('/api/product/filter', GetProductByCategorie);
router.get('/api/product/:id', GetProductById);
router.patch('/api/product/:id', Auth, upload, isProductOwner, UpdateProductById);
router.delete('/api/product/:id', Auth, isProductOwner, DeletProductById);
router.get('/api/products/myproducts', Auth, ShowMyProduncts);

module.exports = router;
