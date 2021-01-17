// Page Details:
////    route that handles the creation of products

const path = require('path');

const express = require('express');

const rootDir = require('../utilities/path');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product Page',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    })
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push({
        title: req.body.title
    })
    res.redirect('/');
});

exports.routes = router;
exports.products = products;