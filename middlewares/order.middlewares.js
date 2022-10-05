const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productInCart.model');

const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findOne({
        where: {id},
        attributes: ['id', 'totalPrice', 'createdAt', 'userId'],
        include: [
            {
                model: Cart,
                attributes: { exclude: ['status'] },
                include: [
                    {
                        model: ProductsInCart,
                        where: {
                            status: 'purchased',
                        },
                    },
                ],
            },
        ],
    });

    if (!order) {
        return next(new AppError('order not found', 404));
    }

    req.order = order;
    next();
});

module.exports = { orderExists };
