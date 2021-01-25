// core modules import
const path = require('path');

// Third party packages
const express = require('express');
const bodyParser = require('body-parser');

// import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// import models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// import help functions
const getCircularReplacer = require('./utilities/circular-replacer');

// import controllers
const errorController = require('./controllers/error');
const sequelize = require('./utilities/database');

// create PORT
const PORT = process.env.PORT || 3000;

// create app object
const app = express();

// import ejs
app.set('view engine', 'ejs');
// telling express that the templates will be under the views folder | default is views | 2nd parameter
app.set('views', 'views');

// parsing body | done before action middleware(s)
app.use(bodyParser.urlencoded({
    extended: true
}));
// static files | static files, path is automatically put into public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // reach out to database and return user
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log('app.js, get User error: ' + error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// if no page is found --> send to 404 page
app.use(errorController.get404);

// relations || associations
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
});


// based on your models, it automatically inspects them and creates tables for your models
sequelize
    .sync()
    .then(result => {
        // create user
        return User.findByPk(1);
    }).then(user => {
        if (!user) {
            return User.create({
                name: 'Matthew',
                email: 'fake@fake.com'
            })
        }
        return user;
    })
    .then(user => {
        // console.log('app.js, sequelize.sync(), User: ' + JSON.stringify(user, getCircularReplacer()));
        return user.createCart();
    })
    // .then(cart => {
    //     // listen to port or 3000
    //     app.listen(PORT);
    // })
    .catch(error => console.log('this is within the sync method in app.js: ' + error));

app.listen(PORT);