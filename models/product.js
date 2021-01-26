// represent a single entity (product)
// this is representing what a single product looks like

// import mongoDb
const mongodb = require('mongodb');

// imports
const getDb = require('../utilities/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
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

            })
            .catch(err => console.log('product.js | save() method, Error Handling: ' + err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
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
                return product;
            })
            .catch(err => console.log('product.js | findById() method, Error Handling: ' + err));
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({
                _id: new mongodb.ObjectId(prodId)
            })
            .then(prodId + ' deleted!')
            .catch(err => console.log('product.js | deleteById() method, Error Handling: ' + err));
    }

}

module.exports = Product;