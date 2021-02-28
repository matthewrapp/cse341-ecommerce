// node core modules
const fileSystem = require('fs');
const path = require('path');

// import 3rd party modules
const PDFDocument = require('pdfkit');

// import Product class from models
const Product = require('../models/product');
const Order = require('../models/order');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');
const product = require('../models/product');

// global variables
const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                docTitle: 'All Products Page',
                path: '/products',
                prods: products,
                searchProduct: null
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                docTitle: product.title + ' Page',
                product: product,
                path: '/products',
                searchProduct: null
                // isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getSearchedProduct = (req, res, next) => {
    const searchItem = req.query.search;
    // console.log(Product.find().then(products => {
    //     consle.log(products);o
    // }))
    Product.find({
            'title': {
                $regex: searchItem,
                $options: 'i'
            }
        })
        .then(product => {
            res.render('shop/product-list', {
                docTitle: 'Products Page',
                prods: null,
                searchProduct: product,
                path: '/products'
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getIndex = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let totalItems;
    
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                docTitle: 'Shop Page',
                path: '/',
                prods: products,
                searchProduct: null,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProductsByCategory = (req, res, next) => {
    products = req.query.category
    Product.find({
            'category': products
        }).then(products => {
            res.render('shop/product-list', {
                docTitle: 'Shop Page',
                path: '/category',
                prods: products,
                searchProduct: null
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No Order Found.'));
            }

            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            // create a pdf per order
            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(fileSystem.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: false
            });
            pdfDoc.text('__________________');
            pdfDoc.text(' ');
            let totalPrice = 0;
            order.products.forEach(product => {
                totalPrice += product.quantity * product.productData.price;
                pdfDoc.fontSize(14).text(product.productData.title + ' - ' + product.quantity + ' x ' + '$' + product.productData.price);
            });
            pdfDoc.text('___');
            pdfDoc.text(' ');
            pdfDoc.fontSize(20).text('Total Price: $:' + totalPrice);

            pdfDoc.end();

            // fileSystem.readFile(invoicePath, (err, data) => {
            //     if (err) {
            //     return next(err);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            //     res.send(data);
            // });
            // const file = fileSystem.createReadStream(invoicePath);
            
            // file.pipe(res);
        })
        .catch(err => {
            next(err)
        })
}