// Models
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const addProductToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const { cart } = req;

    const productInCart = await ProductsInCart.create({
        cartId: cart.id,
        productId,
        quantity,
    })

    res.status(201).json({
        status: 'success',
        data: {
            cart,
            productInCart,
        },
    })
});

const updateCart = catchAsync(async (req, res, next) => {
    const { quantity } = req.body;
    const { productInCart } = req;
    const { product } = req;

    // If I have save the real quantity  in productInCart, because It have a bug
    const realQuantity = productInCart.quantity;

    if (quantity && !isNaN(quantity)) {
        // New quantity to save in product
        const newQty = product.quantity + realQuantity - quantity;

        // update product quantity
        await updateQuantity(product, newQty, 'update');

        // Once the product has been updated, we update productInCart
        await productInCart.update({ quantity });
    }

    res.status(200).json({
        status: 'success',
        data: {
            productInCart,
            product,
        },
    });
});

const deleteProductInCart = catchAsync(async (req, res, next) => {
    const { productInCart } = req;
    const { product } = req;

    await productInCart.update({ quantity: 0, status: 'removed' });

    updateQuantity(product, productInCart.quantity, 'increment');

    res.status(200).json({
        status: 'success',
        data: { productInCart },
    });
});

const purchasesCart = catchAsync(async (req, res, next) => {
    const { sessionUser, cart } = req

    let totalPrice = 0

    const productsInCartPromises = cart.productsInCarts.map(
        async (productInCart) => {
            const product = await Product.findOne({
                where: { id: productInCart.productId },
            })

            const subTotal = product.price * productInCart.quantity

            const newQuantity = product.quantity - productInCart.quantity

            totalPrice += subTotal

            await product.update({ quantity: newQuantity })

            await productInCart.update({ status: 'purchased' })
        }
    )

    await cart.update({
        status: 'purchased',
    })

    await Promise.all(productsInCartPromises)

    const order = await Order.create({
        userId: sessionUser.id,
        cartId: cart.id,
        totalPrice,
    })

    res.status(201).json({
        status: 'success',
        data: { order },
    })
});

module.exports = {
    addProductToCart,
    updateCart,
    deleteProductInCart,
    purchasesCart,
};
