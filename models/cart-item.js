// cart item model

const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;