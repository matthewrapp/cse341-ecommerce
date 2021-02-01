// import Product class from models
const Product = require('../models/product');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product Page',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product.save() // this save method is created by mongoose
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(error => console.log('postAddProduct error handling: ' + error));

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
                isAuthenticated: req.session.isLoggedIn
            })
        }).catch(error => console.log('admin.js, getEditProduct error handling: ' + error));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save()
        })
        .then(result => {
            console.log('admin.js, postEditProduct UPDATED PRODUCT: ' + JSON.stringify(result, getCircularReplacer()));
            res.redirect('/admin/products');
        })
        .catch(error => console.log('admin.js, postEditProduct error handling: ' + error))
}

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId', 'name -_id')
        .then(products => {
            res.render('admin/products', {
                docTitle: 'Admin Products Page',
                path: '/admin/products',
                prods: products,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(error => console.log('admin.js, getProducts error handling: ' + error));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(error => console.log('admin.js, postDeleteProduct: ' + error));
}