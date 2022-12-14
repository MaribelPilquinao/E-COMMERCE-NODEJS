const { Category } = require('../models/category.model');

const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const categoryExist = catchAsync(async (req, res, next) => {
    const id = req.params.id || req.body.categoryId

    const category = await Category.findOne({
        where: { id, status: 'active' },
    });

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    req.category = category;
    next();
});

module.exports = { categoryExist };
