const express = require('express');

// controllers
const {
    createsUser,
    createLogin,
    updateUser,
    deleteUser,
    getAllProductUser,
} = require('../controllers/user.controller');

const { ordersRouter } = require('../routes/order.routes')

// Middlewares
const { userExists } = require('../middlewares/user.middlewares');
const {
    createUserValidators,
    loginValidations,
} = require('../middlewares/validators.middlewares');
const {
    protectSession,
    protectUsersAccount,
} = require('../middlewares/auth.middlewares');

// Routers
const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createsUser);

usersRouter.post('/login', loginValidations, createLogin);

usersRouter.use(protectSession)

usersRouter.get('/me', getAllProductUser);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.use('/orders', ordersRouter)

module.exports = { usersRouter };
