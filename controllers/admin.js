// import Product class from models
const Product = require('../models/product');
const {
    get
} = require('../routes/shop');

// import helper utitlities
const getCircularReplacer = require('../utilities/circular-replacer');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product Page',
        path: '/admin/add-product',
        editing: false
    })
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    // magic function by sequelize
    req.user.createProduct({
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl
        })
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
    req.user.getProducts({
        where: {
            id: prodId
        }
    }).then(products => {
        const product = products[0];
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product Page',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        })
    }).catch(error => console.log('admin.js, getEditProduct error handling: ' + error));


    // Product.findByPk(prodId).then((product) => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         docTitle: 'Edit Product Page',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     })
    // }).catch(error => console.log('admin.js, getEditProduct error handling: ' + error));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;

            return product.save();
        })
        .then(result => {
            console.log('admin.js, postEditProduct UPDATED PRODUCT: ' + JSON.stringify(result, getCircularReplacer()));
            res.redirect('/admin/products');
        })
        .catch(error => console.log('admin.js, postEditProduct error handling: ' + error))
}


exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                docTitle: 'Admin Products Page',
                path: '/admin/products',
                prods: products,
            });
        }).catch(error => console.log('admin.js, getProducts error handling: ' + error))

    // Product.fetchAll((products) => {
    //     res.render('admin/products', {
    //         docTitle: 'Admin Products Page',
    //         path: '/admin/products',
    //         prods: products,
    //     });
    // });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => console.log('admin.js, destroyed product: ' + JSON.stringify(reuslt, getCircularReplacer())))
        .catch(error => console.log('admin.js, postDeleteProduct: ' + error));
    res.redirect('/admin/products');

}