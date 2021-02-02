// import 3rd party packages
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// import models
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_user: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null
    }
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login Page',
        errorMessage: errorMessage
    });
};

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null
    }
    res.render('auth/signup', {
        path: '/signup',
        docTitle: 'Signup Page',
        errorMessage: errorMessage
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        // need to call save if the page is loading too fast before the database can update the page
                        return req.session.save((err) => {
                            console.log(err + ' within .then() within postLogin');
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log('auth.js | postLogin | Error Handling: ' + err);
                    res.redirect('/login');
                });
        })
        .catch(error => console.log('app.js, get User error: ' + error));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({
            email: email
        })
        .then(userDocument => {
            if (userDocument) {
                req.flash('error', 'Email already exists. Please user another email.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    });
                    if (confirmPassword != password) {
                        req.flash('error', 'Passwords do not match. Please try again.');
                        return res.redirect('/signup');
                    } else {
                        return user.save();
                    }
                })
                .then(result => {
                    res.redirect('/login');
                    // send email
                    return transporter.sendMail({
                        to: email,
                        from: 'mattrapp25@gmail.com',
                        subject: 'Signup Succeeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    })
                })
                .catch(err => {
                    console.log('auth.js | postSignUp() | Error with email | Error Handling: ' + err)
                });
        })
        .catch(err => {
            console.log('auth.js | postSignup | Error Authentication: ' + err)
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err + ', within postLogoutMethod')
        res.redirect('/');
    });
};