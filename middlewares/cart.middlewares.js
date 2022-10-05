const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const verifyProductNotExceedQuantity = (req, res, next) => {
    const { product } = req;
    const { quantity } = req.body;

    if (!product) {
        return next(
            new AppError('You cannot exceed the available quantity', 404)
        );
    } else if (quantity > product.quantity) {
        return next(new AppError(`This product only has ${product.quantity} items.`, 404));
    }
    next();
};

const productInCartExist = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body

    const { cart } = req

    const productInCart = await ProductsInCart.findOne({
        where: {
            cartId: cart.id,
            productId,
        },
    })

    if (!productInCart) {
        return next()
    }

    if (productInCart.status === 'active') {
        return next(new AppError('This product already in the cart', 400))
    }

    if (productInCart.status === 'removed') {
        await productInCart.update({
            status: 'active',
            quantity,
        })
        res.status(200).json({
            status: 'success',
            data: { productInCart },
        })
    }
});


const validExistProductInCartParams = catchAsync(async (req, res, next) => {
    const productId  = req.body.id || req.params
    const id  = req.params  || req.bod.productId

    const productInCart = await ProductsInCart.findOne({
        where: { productId, status: 'active' },
    });

    if (!productInCart) {
        return next(
            new AppError('This product does not exist in the cart', 404)
        );
    }

    req.productInCart = productInCart;
    next();
});


const cartIsActive = catchAsync(async (req, res, next) => {
    const { sessionUser } = req

    let cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' },
        include: {
            model: ProductsInCart,
            required: false,
            where: { status: 'active' },
        },
    })

    if (!cart) {
        cart = await Cart.create({
            userId: sessionUser.id,
        })
    }

    req.cart = cart

    next()
})

module.exports = {
    verifyProductNotExceedQuantity,
    productInCartExist,
    validExistProductInCartParams,
    cartIsActive,
};
