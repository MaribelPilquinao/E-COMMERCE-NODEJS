const express = require('express');

// Controllers
const {
    getAllProducts,
    getProductById,
    createProducts,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller');

// Middlewares
const { productExists } = require('../middlewares/product.middlewares');
const {
    createProductsValidations,
} = require('../middlewares/validators.middlewares');
const {
    protectSession,
    protectUsersAccount,
} = require('../middlewares/auth.middlewares');

// Routers

const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);

productsRouter.get('/:id', getProductById);

productsRouter.use(protectSession)

productsRouter.post('/', createProducts);

productsRouter.patch('/:id', productExists, updateProduct);

productsRouter.delete('/:id', productExists, deleteProduct);

module.exports = { productsRouter };
