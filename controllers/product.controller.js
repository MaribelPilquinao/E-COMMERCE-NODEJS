// Models
const { Product } = require('../models/product.model');
const { ProductImg } = require('../models/productImgs.model');
const { Category } = require('../models/category.model');

const { catchAsync } = require('../utils/catchAsync.util');
const {
    uploadProductImgs,
    getProductImgsUrls,
    getProductsImgsUrls,
} = require('../utils/firebase.util');

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

    await uploadProductImgs(req.files, newProduct.id);

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
            'userId',
            'createdAt',
        ],
        include: [
            {
                model: ProductImg,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'imgUrl'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ],
    });
    const productsWithImgs = await getProductsImgsUrls(products);

    res.status(200).json({
        status: 'success',
        data: { products: productsWithImgs },
    });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.product;

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
        include: [
            {
                model: ProductImg,
                required: false,
                where: { status: 'active' },
                attributes: ['id', 'imgUrl'],
            },
            {
                model: Category,
                attributes: ['id', 'name'],
            },
        ],
    });

    const productWithImgs = await getProductImgsUrls(product);

    res.status(200).json({
        status: 'success',
        data: { product: productWithImgs },
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
