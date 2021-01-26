// import Product class from models
const Product = require('../models/product');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                docTitle: 'All Products Page',
                path: '/products',
                prods: products,
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
                path: '/products'
            })
        })
        .catch(error => console.log('getProduct Error Handling: ' + error));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                docTitle: 'Shop Page',
                path: '/',
                prods: products,
            });
        })
        .catch(error => console.log('getIndex Error Handling: ' + error));
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            // get products within the cart
            res.render('shop/cart', {
                docTitle: 'Cart Page',
                path: '/cart',
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
            // console.log('shop.js | postCart() returned: ' + result);
            res.redirect('/cart');
        })
        .catch(error => console.log('shop.js, postCart() Error Handling: ' + error));

    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({
    //             where: {
    //                 id: prodId
    //             }
    //         })
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0) {
    //             product = products[0];
    //         }
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }
    //         return Product.findByPk(prodId);
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, {
    //             through: {
    //                 quantity: newQuantity
    //             }
    //         })
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(error => console.log('shop.js, postCart(), Error Handling: ' + error))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => console.log('shop.js, postCartDeleteProduct, Error Handling: ' + error));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => console.log('shop.js, postOrder => getCart(), Error Handling: ' + error))
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
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