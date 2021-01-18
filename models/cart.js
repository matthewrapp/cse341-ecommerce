const fileSystem = require('fs');
const path = require('path');

// global variables
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');


module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch the previous cart
        console.log(JSON.stringify(productPrice));
        fileSystem.readFile(p, (error, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0
            }
            // our card will have to be created if we get error; Otherwise, we will just add to existing cart
            if (!error) {
                cart = JSON.parse(fileContent);
            }

            // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex((prod) => {
                if (prod.id === id) {
                    return prod;
                };
            });
            const existingProduct = cart.products[existingProductIndex];
            // add new product / increase quantity
            let updatedProduct;
            if (existingProduct) {
                // ... notation takes everything from the existingProduct object
                updatedProduct = {
                    ...existingProduct
                };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id: id,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fileSystem.writeFile(p, JSON.stringify(cart), (error) => {
                console.log(error);
            })
        });
    }

    static deleteProduct(id, productPrice) {

        fileSystem.readFile(p, (error, fileContent) => {
            if (error) {
                return;
            }
            const updatedCart = {
                ...JSON.parse(fileContent)
            };
            const product = updatedCart.products.find((prod) => {
                if (prod.id === id) {
                    return prod;
                }
            });
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter((prod) => {
                if (prod.id !== id) {
                    return prod;
                }
            })
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);

            fileSystem.writeFile(p, JSON.stringify(updatedCart), (error) => {
                console.log(error);
            })
        })
    }

    static getCart(callback) {
        fileSystem.readFile(p, (error, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (error) {
                callback(null);
            } else {
                callback(cart);
            }
        })
    }
}