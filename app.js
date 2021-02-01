// core modules import
const path = require('path');

// Third party packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// import controllers
const errorController = require('./controllers/error');

// import models
const User = require('./models/user');

// import help functions
const getCircularReplacer = require('./utilities/circular-replacer');

// create PORT
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://matthewrapp:GK2uY8VGgnCKYKwf@cluster0.hw43b.mongodb.net/shop?retryWrites=true&w=majority';

// create app object
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
});

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
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(error => console.log('app.js, get User error: ' + error));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// if no page is found --> send to 404 page
app.use(errorController.get404);

const corsOptions = {
    orgin: 'https://cse341matthewrapp-ecommerce.herokuapp.com',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

mongoose.connect(MONGODB_URL, options)
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