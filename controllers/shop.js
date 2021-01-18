// import Product class from models
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    // fetch all products
    const products = Product.fetchAll((products) => {
        res.render('shop/product-list', {
            docTitle: 'All Products Page',
            path: '/products',
            prods: products,
        });
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, (product) => {
        res.render('shop/product-detail', {
            docTitle: product.title + ' Page',
            product: product,
            path: '/products'
        })
    })
}

exports.getIndex = (req, res, next) => {
    // fetch all products
    Product.fetchAll((products) => {
        res.render('shop/index', {
            docTitle: 'Shop Page',
            path: '/',
            prods: products,
        });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Cart Page',
        path: '/cart'
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Orders Page',
        path: '/orders'
    })
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout Page',
        path: '/checkout'
    })
};