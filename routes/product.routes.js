const express = require('express');

// Controllers
const {
    getAllProducts,
    getProductById,
    createProducts,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller');

const {
    getAllCategories,
    createCategory,
    updateCategoy,
} = require('../controllers/category.controller');

// Middlewares
const { productExists } = require('../middlewares/product.middlewares');
const {
    createProductsValidations,
    categoryValidators,
    updateProductValidators,
} = require('../middlewares/validators.middlewares');
const {
    protectSession,
    protectProductOwner,
} = require('../middlewares/auth.middlewares');
const { categoryExist } = require('../middlewares/category.middlewares');

// Utils
const { upload } = require('../utils/multer.ultil');

// Routers

const productsRouter = express.Router();

productsRouter.get('/', getAllProducts);

productsRouter.get('/categories', getAllCategories);

productsRouter.get('/:id', productExists, getProductById);

productsRouter.use(protectSession);

productsRouter.post(
    '/',
    upload.array('productImg', 5),
    createProductsValidations,
    categoryExist,
    createProducts
);

productsRouter.patch(
    '/:id',
    productExists,
    protectProductOwner,
    updateProductValidators,
    updateProduct
);

productsRouter.delete(
    '/:id',
    productExists,
    protectProductOwner,
    deleteProduct
);

productsRouter.post('/categories', categoryValidators, createCategory);

productsRouter.patch(
    '/categories/:id',
    categoryExist,
    categoryValidators,
    updateCategoy
);

module.exports = { productsRouter };
