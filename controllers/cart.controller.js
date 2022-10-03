// Models
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const addProductToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const { sessionUser } = req;

    // Verify if the cart is empty if not, change it to active
    const userCart = Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' },
    });
    if (!userCart) {
        return next(new AppError('Cart user not found', 404));
    }

    // !verify If productInCart is already exist COMPROBAR SI FUNCIONA
    // *creo que el if puede NO funcionar, pero aun no lo puedo probar
    const productInCartExistInCart = await ProductsInCart.findOne({
        where: { cartId: userCart.id, productId, status: 'active' },
    });
    if (!productInCartExistInCart) {
        return next(
            new AppError('The product is already exist in your cart', 404)
        );
    }

    // Created, we can create and add products to the cart
    const productInCart = await ProductsInCart.create({
        cartId: userCart.id,
        productId,
        quantity,
    });

    res.status(200).json({
        status: 'success',
        data: {
            productInCart,
            userCart,
        },
    });
});

const updateCart = catchAsync(async (req, res, next) => {
    
});

const deleteProductInCart = catchAsync(async (req, res, next) => {});

const purchasesCart = catchAsync(async (req, res, next) => {});

module.exports = {
    addProductToCart,
    updateCart,
    deleteProductInCart,
    purchasesCart,
};
