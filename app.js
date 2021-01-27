// core modules import
const path = require('path');

// Third party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// import controllers
const errorController = require('./controllers/error');

// import models
const User = require('./models/user');

// import help functions
const getCircularReplacer = require('./utilities/circular-replacer');

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
    User.findById('6010d6100202953dec5766fc')
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

mongoose.connect('mongodb+srv://matthewrapp:GK2uY8VGgnCKYKwf@cluster0.hw43b.mongodb.net/shop?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Max',
                    email: 'max@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(PORT);
    })
    .catch(err => {
        console.log('Error connecting to Mongoose: ' + error);
    })