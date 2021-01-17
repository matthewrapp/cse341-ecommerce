// import Product class from models
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product Page',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
};

exports.postAddProduct = (req, res, next) => {
    // create new object based on Product class
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    // fetch all products
    const products = Product.fetchAll((products) => {
        res.render('shop', {
            docTitle: 'Shop Page',
            path: '/shop',
            prods: products,
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};