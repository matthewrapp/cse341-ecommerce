// represent a single entity (product)
// this is representing what a single product looks like

const fileSystem = require('fs');
const path = require('path');

// global variables
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// import models
const Cart = require('./cart');

// helper functions
const getProductsFromFile = (callback) => {
    fileSystem.readFile(p, (error, fileContent) => {
        if (error) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((productsArray) => {
            if (this.id) {
                const existingProductIndex = productsArray.findIndex((prod) => {
                    if (prod.id === this.id) {
                        return prod;
                    }
                });
                const updatedProducts = [...productsArray];
                updatedProducts[existingProductIndex] = this;
                fileSystem.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                    console.log(error + 'error');
                });
            } else {
                this.id = Math.random().toString();
                productsArray.push(this);
                fileSystem.writeFile(p, JSON.stringify(productsArray), (error) => {
                    console.log(error + 'error');
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile((productsArray) => {
            const product = productsArray.find((prod) => {
                if (prod.id === id) {
                    return prod;
                }
            })
            const updatedProducts = productsArray.filter((prod) => {
                if (prod.id !== id) {
                    return prod;
                }
            });
            fileSystem.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                if (!error) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    // static allows you to call on the class itself, not instances of the class
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findById(id, callback) {
        getProductsFromFile((products) => {
            const product = products.find((prod) => {
                if (prod.id === id) {
                    return prod;
                }
            });
            callback(product);
        });
    }
}