// Page Details:
////   Authentication routes
const express = require('express');
const {
    check,
    body
} = require('express-validator');

// import controllers
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

// import models
const User = require('../models/user');

// router is like a mini express app which we can export | Ex) Instead of const app = express(); it's const router = express.Router();
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login',
    [
        body('email', 'Please enter a valid email address.')
        .isEmail()
        .normalizeEmail(),
        body('password', 'Please enter a valid password.')
        .isLength({
            min: 8
        })
        .isAlphanumeric()
        .trim()
    ], authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup',
    [
        check('email', 'Please enter a valid email address.')
        .isEmail()
        .custom((value, {
            req
        }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('this email address is forbidden');
            // }
            // return true;
            return User.findOne({
                    email: value
                })
                .then(userDocument => {
                    if (userDocument) {
                        return Promise.reject('Email already exists. Please user another email.');
                    };
                })
        })
        .normalizeEmail(),
        body('password', 'Please enter a password only numbers and test and at least 5 characters.')
        .isLength({
            min: 8
        })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match.');
            }
            return true
        })
    ], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;