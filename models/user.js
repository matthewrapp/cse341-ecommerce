// user model

const Sequelize = require('sequelize');
const sequelize = require("../utilities/database");

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING

})

module.exports = User;