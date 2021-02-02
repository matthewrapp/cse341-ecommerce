// Page Details:
////    route that handles the creation of products

const path = require('path');
const express = require('express');

// controller imports
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

// /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.post('/add-product', isAuth, adminController.postAddProduct);

// // /admin/edit-product
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);

// // /admin/delete-product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = router;