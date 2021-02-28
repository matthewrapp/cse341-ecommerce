// Page Details:
////   what the user sees
const path = require('path');
const {
    check,
    body
} = require('express-validator');

// import controllers
const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const express = require('express');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId', isAuth, shopController.getInvoice);
router.get('/query-searched-items',
    [
        check('search')
        .trim()
    ], shopController.getSearchedProduct);
router.get('/getProductCategory', shopController.getProductsByCategory);

module.exports = router;