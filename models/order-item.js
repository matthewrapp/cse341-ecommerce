// order item model

const Sequelize = require('sequelize');
const sequelize = require('../utilities/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;