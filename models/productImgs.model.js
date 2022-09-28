const { db, DataTypes } = require('../utils/database.util');

const ProductImg = db.define('productImg', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
    },
});

module.exports = { ProductImg };
