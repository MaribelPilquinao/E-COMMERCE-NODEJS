const { Cart } = require('../models/cart.model');
const { Category } = require('../models/category.model');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
const { ProductsInCart } = require('../models/productInCart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllOrders = catchAsync(async (req, res, next) => {
    const userId = req.sessionUser.id

    const order = await Order.findAll({
        where: { userId },
        attributes: ['id', 'totalPrice'],
        include: {
            model: Cart,
            attributes: ['id', 'status'],
            include: {
                model: ProductsInCart,
                required: false,
                where: { status: 'purchased' },
                attributes: ['id', 'quantity'],
                include: {
                    model: Product,
                    attributes: ['id', 'title', 'description', 'price'],
                    include: { model: Category, attributes: ['id', 'name'] },
                },
            },
        },
    });

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { order } = req;

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

module.exports = { getAllOrders, getOrderById };
