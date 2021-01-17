// represent a single entity (product)
// this is representing what a single product looks like

const fileSystem = require('fs');
const path = require('path');

// global variables
const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

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
    constructor(title) {
        this.title = title;
    }

    save() {
        // save to a file
        ////// old ones and new ones
        getProductsFromFile((productsArray) => {
            productsArray.push(this);
            fileSystem.writeFile(p, JSON.stringify(productsArray), (error) => {
                console.log(error + ' error');
            });
        });
    }

    // static allows you to call on the class itself, not instances of the class
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}