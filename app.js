const express = require('express');

// Routers
const { usersRouter } = require('./routes/user.routes');
const { productsRouter } = require('./routes/product.routes');
const { categoryRouter } = require('./routes/category.routes');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Init Express
const app = express();

app.use(express.json());

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoryRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `${req.method} ${req.url} does not exists in our server`,
    });
});

module.exports = { app };
