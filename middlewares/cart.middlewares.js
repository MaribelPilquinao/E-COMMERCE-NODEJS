const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const verifyProductNotExceedQuantity = (req, res, next) => {};

const productInCartExist = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const { productId } = req.body;
    // const { id } = req;

    // verify if the user have an active cart
    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });

    // Check if the productInCart exist, and product

    const productInCart = await ProductsInCart.findOne({
        where: { productId, cartId: cart.id, status: 'active' },
    });

    const product = await Product.findOne({
        where: { id, status: 'active' },
    });

    if (!productInCart || !product) {
        return next(
            new AppError('The product does not exist in the cart', 400)
        );
    }

    req.productInCart = productInCart;
    req.product = product;

    next();
});

// !AGREGAR A LA RUTA CUANDO ESTÉ LISTO EL CONTROLLER MIENTRAS ESTOY VALIDANDO QUE EXISTA POR EL ID
const validExistProductIdByParams = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findOne({
        where: {
            id: productId,
            status: true,
        },
    });

    if (!product) {
        return next(new AppError('there is no id with that product', 404));
    }

    next();
});

// * VALIDO QUE EXISTA EL PRODUCTO EN EL CARRITO POR EL ID
const validExistProductInCartParams = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

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

module.exports = {
    verifyProductNotExceedQuantity,
    productInCartExist,
    validExistProductIdByParams,
    validExistProductInCartParams,
};
