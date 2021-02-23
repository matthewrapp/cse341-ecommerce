// Page Details:
////    route that handles the creation of products

const path = require('path');
const express = require('express');
const {
    check,
    body
} = require('express-validator');

// controller imports
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

// /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product',
    [
        body('title', 'This is the title err msg')
        .isString()
        .isLength({
            min: 3
        })
        .trim(),
        body('price', 'This is the price err msg')
        .isFloat(),
        check('category', 'Need to select a category.')
        .custom((value, {
            req
        }) => {
            if (value === 'none') {
                // throw new Error('Need to select a category.')
                return false
            }
            return true
        }),
        body('description', 'This is the descriptin err msg')
        .isLength({
            min: 15,
            max: 1500
        })
        .trim()
    ], isAuth, adminController.postAddProduct);

// // /admin/edit-product
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', [
    body('title', 'This is the title err msg')
    .isString()
    .isLength({
        min: 3
    })
    .trim(),
    body('price', 'This is the price err msg')
    .isFloat(),
    check('category', 'Need to select a category.')
    .custom((value, {
        req
    }) => {
        if (value === 'none') {
            // throw new Error('Need to select a category.')
            return false
        }
        return true
    }),
    body('description', 'This is the descriptin err msg')
    .isLength({
        min: 15,
        max: 1500
    })
    .trim()
], isAuth, adminController.postEditProduct);

// // /admin/delete-product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;