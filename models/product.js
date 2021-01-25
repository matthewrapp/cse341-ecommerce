// represent a single entity (product)
// this is representing what a single product looks like

// import mongoDb
const mongodb = require('mongodb');

// imports
const getDb = require('../utilities/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = new mongodb.ObjectId(id);
    }

    save() {
        const db = getDb();
        let dbOperation;
        if (this._id) {
            // Update the product
            dbOperation = db.collection('products').updateOne({
                _id: this._id
            }, {
                $set: this
            });
        } else {
            // Add the product
            dbOperation = db.collection('products').insertOne(this);
        }
        return dbOperation
            .then(result => {
                console.log('this is the result' + result);
            })
            .catch(err => console.log('product.js | save() method, Error Handling: ' + err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                console.log('products.js | fetchAll() method, Products returned: ' + products);
                return products;
            })
            .catch(err => console.log('product.js | fetchAll() method, Error Handling: ' + err));
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products').find({
                _id: new mongodb.ObjectId(prodId)
            })
            .next()
            .then(product => {
                console.log('products.js | fetchAll() method, Product returned: ' + product);
                return product;
            })
            .catch(err => console.log('product.js | findById() method, Error Handling: ' + err));
    }

}

module.exports = Product;