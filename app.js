const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Routers
const { usersRouter } = require('./routes/user.routes');
const { productsRouter } = require('./routes/product.routes');
const { cartRouter } = require('./routes/cart.routes');

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Init Express
const app = express();
// Add security headers
app.use(helmet());

// Compress responses
app.use(compression());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else if (process.env.NODE_ENV === 'production') app.use(morgan('combined'));

app.use(express.json());

// Endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);

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
