const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

// Validations
const checkValidations = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);

        const message = errorMessages.join('. ');

        return next(new AppError(message, 400));
    }
    next();
};

const createUserValidators = [
    body('username')
        .isString()
        .withMessage('Name must be a string')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('role')
        .isString()
        .withMessage('Role must be a string')
        .notEmpty()
        .withMessage('Role cannot be empty')
        .isLength({ min: 3 })
        .withMessage('Role must be at least 3 characters'),
    checkValidations,
];

const loginValidations = [
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isString()
        .withMessage('Password must be a string')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    checkValidations,
];

const createProductsValidations = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .isLength({ min: 3 })
        .withMessage('Description must be at least 3 characters'),
    body('price')
        .isInt({min: 1})
        .withMessage('Price must be a integer'),
    body('categoryId')
        .isInt({min: 1})
        .withMessage('CategoryId must be a integer'),
    body('quantity')
        .isInt({min: 0})
        .withMessage('Quantity must be a integer'),
    checkValidations,
];

const addProductValidators = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('productId must be a integer.'),
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('quantity must be a integer.'),
    checkValidations,
]

const updateProductValidators = [
    body('productId')
        .isInt({ min: 1 })
        .withMessage('productId must be a integer.'),
    body('newQty').isInt().withMessage('quantity must be a integer.'),
    checkValidations,
]

const categoryValidators = [
    body('name')
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
    checkValidations,
]

module.exports = {
    createUserValidators,
    loginValidations,
    createProductsValidations,
    addProductValidators,
    updateProductValidators,
    categoryValidators,
};
