// Page Details:
////   what the user sees

const path = require('path');

const rootDir = require('../utilities/path');
const adminData = require('./admin');

const express = require('express');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products;
    // render pug html
    res.render('shop', {
        docTitle: 'Shop Page',
        path: '/shop',
        prods: products,
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;