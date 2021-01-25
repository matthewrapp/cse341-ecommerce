// Page Details:
////    route that handles the creation of products

const path = require('path');
const express = require('express');

// controller imports
const adminController = require('../controllers/admin');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

// /admin/add-product
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);

// /admin/delete-product
// router.post('/delete-product', adminController.postDeleteProduct);


module.exports = router;