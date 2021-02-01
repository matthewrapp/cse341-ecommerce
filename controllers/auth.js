const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login Page',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('6010d6100202953dec5766fc')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // need to call save if the page is loading too fast before the database can update the page
            req.session.save((err) => {
                console.log(err + ' within .then() within postLogin');
                res.redirect('/');
            });
        })
        .catch(error => console.log('app.js, get User error: ' + error));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err + ', within postLogoutMethod')
        res.redirect('/');
    });
};