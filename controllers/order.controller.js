const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllOrders = catchAsync(async (req, res, next) => {
    const { sessionUser } = req.id;

    const order = await Order.findAll({
        where: { id, sessionUser },
        attributes: ['id', 'userId', 'cartId', 'totalPrice', 'status'],
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
