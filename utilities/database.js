// set up the code that will allow us to connect to sql database

const mysql = require('mysql2');

// create a connection pool (pool of connections)
const pool = mysql.createPool({
    // info about database engine connecting too
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'Music4life!'
});

module.exports = pool.promise();