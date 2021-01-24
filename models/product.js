// represent a single entity (product)
// this is representing what a single product looks like

// import models
const Cart = require('./cart');


// import database pool object
const db = require('../utilities/database');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]);
    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}