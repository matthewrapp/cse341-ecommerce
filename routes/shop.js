// Page Details:
////   what the user sees

const path = require('path');

// import controllers
const productsController = require('../controllers/products');

const express = require('express');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;