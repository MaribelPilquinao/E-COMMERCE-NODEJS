const { Category } = require('../models/category.model');


const { catchAsync } = require('../utils/catchAsync.util');

const getAllCategories = catchAsync(async (req, res, next) => {
    const category = await Category.findAll({ where: { status: 'active' } });

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const category = new Category({ name });

    await category.save();
    res.status(201).json({
        status: 'success',
    });
});

const updateCategoy = catchAsync(async (req, res, next) => {
    
    const { name } = req.body;
    const { category } = req;

    await category.update({ name });

    res.status(200).json({
        status: 'success',
        data: { category },
    });
});

module.exports = { getAllCategories, createCategory, updateCategoy };
