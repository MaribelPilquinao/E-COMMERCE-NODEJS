const { Order } = require('../models/order.model');
// !falta exportar modelo CArt y productInCart

const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { sessionUser } = req;

    const order = await Order.findOne({
        where: {
            id,
            userId: sessionUser.id,
            status: true,
        },
        attributes: { exclude: ['status'] },
        // include: [{
        //   model: Cart, attributes: { exclude: ['status'] },
        //   include: [{
        //     model: ProductInCart, where: {
        //       status: 'purchased'
        //     }
        //   }]
        // }]
    });

    if (!order) {
        return next(new AppError('order not found', 404));
    }

    req.order = order;
    next();
});

module.exports = { orderExists };
