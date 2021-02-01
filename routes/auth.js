// Page Details:
////   Authentication routes
const express = require('express');

// import controllers
const authController = require('../controllers/auth');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;