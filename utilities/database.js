// set up the code that will allow us to connect to sql database

const {
    Sequelize
} = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'node-complete', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306'
});

module.exports = sequelize;