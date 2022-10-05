const express = require('express');

// Controllers
const {
    getAllOrders,
    getOrderById,
} = require('../controllers/order.controller');

// middlewares
const { protectOrderOwner } = require('../middlewares/auth.middlewares');
const { orderExists } = require('../middlewares/order.middlewares');

const ordersRouter = express.Router();

ordersRouter.get('/', getAllOrders);

ordersRouter.get('/:id', orderExists, protectOrderOwner, getOrderById);

module.exports = { ordersRouter };
