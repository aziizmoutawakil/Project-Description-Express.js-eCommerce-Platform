const productSchema = require('../models/product.Schema')
const jwt = require('jsonwebtoken')


exports.AddProduct = async (req, res) => {
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
        const { title, price, categorie } = req.body;
        const image = req.file;

        if (!title || !price || !categorie || !image) {
            return res.status(400).json({ error: 'All fields are required (title, price, categorie, image)' });
        }

        const newProduct = new productSchema({
            title,
            price,
            categorie,
            owner: userId,
            image: image.path
        });

        const savedProduct = await newProduct.save();
        res.json({ data: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
};

// ShowMyProduncts
exports.ShowMyProduncts = async (req,res) => {
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

        if (!decoded ||  !decoded.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userId = decoded.userId;
        const products = await productSchema.find({ owner: userId });

        res.json({ data: products });
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ error: 'Error occurred while fetching user products' });
    }
}

//filter products by categorie
exports.GetProductByCategorie = async (req, res) => {
    try {
        const { categorie } = req.query
        const products = await productSchema.find({ categorie: categorie })
        res.json({ data: products })
    } catch (error) {
        console.error('error fetching products : ', error)
        res.status(500), json({ error: 'error occurred while fetching products' })
    }
}

//get all products
exports.GetAllProductBy = async (req, res) => {
    try {
        const Product = await product.find();
        if (!Product) {
            res.status(404).json({ error: 'Product not found' })
        }
        res.json({ data: Product })
    }
    catch (error) {
        console.error({ 'error gitting product': error })
        res.status(500).json({ error: 'An error occurred while fetching user' })
    }
}



//get Product by id
exports.GetProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const Product = await product.findById(id);
        if (!Product) {
            res.status(404).json({ error: 'Product not found' })
        }
        res.json({ data: Product })
    }
    catch (error) {
        console.error({ 'error gitting product': error })
        res.status(500).json({ error: 'An error occurred while fetching user' })
    }
}

//update product
exports.UpdateProductById = async (req, res) => {
    try {
        const { id } = req.params;  
        const { title, price, categorie,description,stock  } = req.body;  
        if (price && isNaN(price)) {
            return res.status(400).json({ error: 'Price must be a number' });
        }
        
        let image;
        if (req.file) {
            image = req.file.path;
        }
        const updateProduct = { title, price, categorie,description,image,stock }; 
        Object.keys(updateProduct).forEach(key => {
            if (updateProduct[key] === undefined) {
                delete updateProduct[key];
            }
        });

        // Find and update the product by ID
        const product = await productSchema.findByIdAndUpdate(id, updateProduct, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product Not Found' }); // Send response if product not found
        }

        res.json({ data: product }); 
    } catch (error) {
        console.error('Error updating product:', error.message); // Log the error message
        console.error('Stack trace:', error.stack); // Log the stack trace for more details
        res.status(500).json({ error: 'An error occurred while updating the product' }); // Send error response
    }
};




exports.DeletProductById = async (req, res) => {
    try {
        const { id } = req.params
        const deleteProduct = await product.findByIdAndDelete(id)

        if (!deleteProduct) {
            res.status(404).json('Product not found')
        }
        res.json({ message: 'Deleting Succsessfuly' })
    }
    catch (error) {
        console.error('error deleting Product', error)
        res.status(500).json({ message: 'An error eccured wher deleting Product' })
    }
}
