// libraries
const crypto = require('crypto');

// import 3rd party packages
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// import models
const User = require('../models/user');
const {
    reset
} = require('nodemon');

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

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null
    }
    res.render('auth/password-reset' /* this is the view path */ , {
        path: '/reset',
        docTitle: 'Reset Password Page',
        errorMessage: errorMessage
    });
};

// action that triggered one they hit the post reset btn
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log('auth.js | postReset() | Error Handling: ' + err);
            return res.redirect('/reset');
        };
        // generate token from buffer
        const token = buffer.toString('hex');
        User.findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'mattrapp25@gmail.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested password reset.</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => {
                console.log('auth.js | postReset() | Error Handling: ' + err)
            });
    })
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                // $gt == great than
                $gt: Date.now()
            }
        })
        .then(user => {
            let errorMessage = req.flash('error');
            if (errorMessage.length > 0) {
                errorMessage = errorMessage[0];
            } else {
                errorMessage = null
            }
            res.render('auth/new-password' /* this is the view path */ , {
                path: '/new-password',
                docTitle: 'Update Password Page',
                errorMessage: errorMessage,
                userId: user._id.toString(),
                passwordToken: token,
                email: user.email
            });

        })
        .catch(err => {
            console.log('auth.js | getNewPassword() | Error Handling: ' + err)
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    console.log(req.body);
    let resetUser;

    if (confirmNewPassword != newPassword) {
        req.flash('error', 'Passwords do not match. Please try again.');
        return res.redirect(`/reset/${passwordToken}`);
    } else {
        User.findOne({
                resetToken: passwordToken,
                resetTokenExpiration: {
                    $gt: Date.now()
                },
                _id: userId
            })
            .then(user => {
                resetUser = user;
                return bcrypt.hash(newPassword, 12);
            })
            .then(hashedPassword => {
                resetUser.password = hashedPassword
                resetUser.resetToken = undefined;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            })
            .then(result => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'mattrapp25@gmail.com',
                    subject: 'Password has been reset!',
                    html: `
                        <p>Password Has been reset!</p>
                    `
                });
            })
            .catch(err => {
                console.log('auth.js | postNewPassword() | Error Handling: ' + err)
            });
    }
}