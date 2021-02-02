// import Product class from models
const Product = require('../models/product');
const Order = require('../models/order');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                docTitle: 'All Products Page',
                path: '/products',
                prods: products
            });
        })
        .catch(error => console.log('getIndex Error Handling: ' + error));
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                docTitle: product.title + ' Page',
                product: product,
                path: '/products',
                // isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(error => console.log('getProduct Error Handling: ' + error));
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                docTitle: 'Shop Page',
                path: '/',
                prods: products
            });
        })
        .catch(error => console.log('getIndex Error Handling: ' + error));
};

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: products
            });
        })
        .catch(error => console.log('shop.js, getCart() Error Handling: ' + error))
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => console.log('shop.js, postCartDeleteProduct, Error Handling: ' + error));
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => {
                return {
                    productData: {
                        ...item.productId._doc
                    },
                    quantity: item.quantity
                }
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => console.log('shop.js, postOrder => getCart(), Error Handling: ' + error))
}

exports.getOrders = (req, res, next) => {
    Order.find({
            'user.userId': req.user._id
        })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                docTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log('shop.js, getOrders => getOrders(), Error Handling: ' + err);
        })
};