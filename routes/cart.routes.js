const express = require('express');

// controllers
const {
    addProductToCart,
    updateCart,
    deleteProductInCart,
    purchasesCart,
} = require('../controllers/cart.controller');

// middlewares
const { protectSession } = require('../middlewares/auth.middlewares');
const {
    productInCartExist,
    
    verifyProductNotExceedQuantity,
    cartIsActive,
} = require('../middlewares/cart.middlewares');
const { productExists } = require('../middlewares/product.middlewares');

const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.post(
    '/add-product',
    cartIsActive,
    productExists,
    productInCartExist,
    verifyProductNotExceedQuantity,
    addProductToCart
);

cartRouter.patch(
    '/update-cart',
    productInCartExist,
    verifyProductNotExceedQuantity,
    updateCart
);

cartRouter.delete('/:productId', productInCartExist, deleteProductInCart);

cartRouter.post('/purchase', cartIsActive, purchasesCart);

module.exports = { cartRouter };
