// Models
const { Cart } = require('./cart.model');
const { Category } = require('./category.model');
const { Order } = require('./order.model');
const { Product } = require('./product.model');
const { ProductImg } = require('./productImgs.model');
const { ProductsInCart } = require('./productInCart.model');
const { User } = require('./user.model');

const initModels = () => {
    // User 1----M Product
    User.hasMany(Product, {foreignKey: 'userId'})
    Product.belongsTo(User)

    // User 1----M Order
    User.hasMany(Order, {foreignKey: 'userId'})
    Order.belongsTo(User)

    // User 1---- 1Cart
    User.hasOne(Cart, {foreignKey: 'userId'})
    Cart.belongsTo(User)

    // Cart 1 ---- 1 Order
    Cart.hasOne(Order, {foreignKey: 'cartId'})
    Order.belongsTo(Cart)

    // Categories 1 ---- M Products
    Category.hasMany(Product, {foreignKey: 'categoryId'})
    Product.belongsTo(Category)

    // Product 1 ---- M ProductsImgs
    Product.hasMany(ProductImg, {foreignKey: 'productId'})
    ProductImg.belongsTo(Product)

    // M Product --- Cart
    Product.belongsTo(Cart, {
        through: 'productsInCart',
        foreignKey: 'productId'
    });
    Cart.belongsToMany(Product, {
        through: 'productsInCart',
        foreignKey: 'cartId'
    })

};

module.exports = { initModels };
