// Models
const { Product } = require('../models/product.model');
const { catchAsync } = require('../utils/catchAsync.util');

const createProducts = catchAsync(async (req, res, next) => {
    const { title, description, price, categoryId, quantity } = req.body;
    const { sessionUser } = req;

    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id,
    });

    res.status(201).json({
        status: 'success',
        data: { newProduct },
    });
});

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { status: 'active' },
        attributes: [
            'id',
            'description',
            'price',
            'quantity',
            'categoryId',
            'userId',
            'createdAt',
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { products },
    });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findOne({
        where: { id, status: 'active' },
        attributes: [
            'id',
            'description',
            'price',
            'quantity',
            'categoryId',
            'userId',
            'createdAt',
        ],
    });

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity } = req.body;
    const { product } = req;

    await product.update({ title, description, price, quantity });

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    // Deshabilitar producto. SOLO EL USUARIO QUIEN CREO EL PRODUCTO
    const { product } = req;

    await product.update({ status: 'Disabled' });

    res.status(200).json({ status: 'success' });
});

module.exports = {
    createProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
