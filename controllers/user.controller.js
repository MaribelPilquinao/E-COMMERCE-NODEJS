const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
// const { Model } = require('sequelize');

dotenv.config({ path: './config.env' });

const createsUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    if (role !== 'admin' && role !== 'normal') {
        return next(new AppError('Invalid role', 400));
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // New user
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
    });

    // Remove password from response
    newUser.password = undefined;

    // Response
    res.status(201).json({
        status: 'success',
        data: { newUser },
    });
});

const getAllProductUser = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
        where: { status: 'active' },
        include: [
            {
                model: Product,
                attributes: [
                    'id',
                    'title',
                    'description',
                    'price',
                    'quantity',
                    'categoryId',
                ],
            },
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { users },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { username, email } = req.body;
    const { user } = req;

    await user.update({ username, email });

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    // Soft delete
    await user.update({ status: 'disabled' });

    res.status(200).json({ status: 'success' });
});

const createLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: 'active' },
    });

    // If user doesn't exists or passwords doesn't match, send error
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Wrong credentials', 400));
    }
   
    user.password = undefined;

    // Generate JWT (payload, secretOrPrivateKey, options)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        status: 'success',
        data: { user, token },
    });
});

module.exports = {
    createsUser,
    createLogin,
    getAllProductUser,
    updateUser,
    deleteUser,
};
