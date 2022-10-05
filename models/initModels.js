// Models
const { Cart } = require('./cart.model');
const { Category } = require('./category.model');
const { Order } = require('./order.model');
const { Product } = require('./product.model');
const { ProductImg } = require('./productImgs.model');
const { ProductsInCart } = require('./productInCart.model');
const { User } = require('./user.model');

const initModels = () => {
     // 1 User <---> M Order
     User.hasMany(Order, { foreignKey: 'userId' })
     Order.belongsTo(User)
 
     // 1 User <---> M Product
     User.hasMany(Product, { foreignKey: 'userId' })
     Product.belongsTo(User)
 
     // 1 User <---> 1 Cart
     User.hasOne(Cart, { foreignKey: 'userId' })
     Cart.belongsTo(User)
 
     // 1 Product <---> 1 Category
     Category.hasMany(Product, { foreignKey: 'categoryId' })
     Product.belongsTo(Category)
 
     // 1 Product <---> M ProductImg
     Product.hasMany(ProductImg, { foreignKey: 'productId' })
     ProductImg.belongsTo(Product)
 
     // 1 Product <---> 1 ProductInCart
     Product.hasOne(ProductsInCart, { foreignKey: 'productId' })
     ProductsInCart.belongsTo(Product)
 
     // 1 Cart <---> M ProductInCart
     Cart.hasMany(ProductsInCart, { foreignKey: 'cartId' })
     ProductsInCart.belongsTo(Cart)
 
     // 1 Cart <---> 1 Order
     Cart.hasOne(Order, { foreignKey: 'cartId' })
     Order.belongsTo(Cart)

};

module.exports = { initModels };
