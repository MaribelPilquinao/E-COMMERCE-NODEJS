const express = require('express');

// Controllers
const {
    getAllOrders,
    getOrderById,
} = require('../controllers/order.controller');

// middlewares
const { protectSession } = require('../middlewares/auth.middlewares');

const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.get('/', getAllOrders);

ordersRouter.get('/:id', getOrderById);

module.exports = { ordersRouter };
