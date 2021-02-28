// import Product class from models
const Product = require('../models/product');

// import mongoose
const mongoose = require('mongoose');

const {
    validationResult
} = require('express-validator');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');
const fileHelper = require('../utilities/file');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product Page',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    // const imageUrl = req.body.imageUrl;
    const image = req.file;
    const description = req.body.description;
    const category = req.body.category;
    const price = req.body.price;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product Page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                description: description,
                category: category,
                price: price
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        })
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product Page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                description: description,
                category: category,
                price: price
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    
    // image path
    const imageUrl = '/' + image.path;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        category: category,
        dateCreated: new Date(),
        lastUpdated: new Date(),
        userId: req.user
    });
    product.save() // this save method is created by mongoose
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit Product Page',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedCategory = req.body.category;
    // const updatedImageUrl = req.body.imageUrl;
    const updatedImage = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Edit Product Page',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                description: updatedDescription,
                price: updatedPrice,
                category: updatedCategory,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (updatedImage) {
                
                if (product.imageUrl.charAt(0) == '/') {
                    let imagePath = product.imageUrl;
                    if (imagePath.charAt(0) == '/') {
                        fileHelper.deleteFile(imagePath.substr(1))
                    } else {
                        fileHelper.deleteFile(imagePath);
                    }
                }

                // fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = '/' + updatedImage.path;
            }
            product.category = updatedCategory;
            product.lastUpdated = new Date();
            return product.save()
                .then(result => {
                    // console.log('admin.js, postEditProduct UPDATED PRODUCT: ' + JSON.stringify(result, getCircularReplacer()));
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find({
            userId: req.user._id
        })
        .then(products => {
            res.render('admin/products', {
                docTitle: 'Admin Products Page',
                path: '/admin/products',
                prods: products
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product Not Found!'));
            }

            if (product.imageUrl.charAt(0) == '/') {
                let imagePath = product.imageUrl;
                if (imagePath.charAt(0) == '/') {
                    fileHelper.deleteFile(imagePath.substr(1))
                } else {
                    fileHelper.deleteFile(imagePath);
                }
            }

            return Product.deleteOne({ _id: prodId, userId: req.user._id });
        })
        .then(() => {
            // res.redirect('/admin/products');
            res.status(200).json({
                message: 'Success!'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Deleting Product Saved!'
            });
        });
}