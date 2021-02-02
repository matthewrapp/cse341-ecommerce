// import 3rd party packages
const bcrypt = require('bcryptjs');

// import models
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login Page',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        docTitle: 'Signup Page',
        isAuthenticated: false
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
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
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