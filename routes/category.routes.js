const express = require('express');

// Controllers
const {
    getAllCategories,
    updateCategoy,
    createCategory,
} = require('../controllers/category.controller');

// Middlewares
const { categoryExist } = require('../middlewares/category.middlewares');

const categoryRouter = express.Router();

categoryRouter.get('/', getAllCategories);

categoryRouter.post('/', createCategory);

categoryRouter.patch('/:id', categoryExist, updateCategoy);

module.exports = { categoryRouter };
