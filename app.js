// core modules import
const path = require('path');

// Third party packages
const express = require('express');
const bodyParser = require('body-parser');

// import routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// import models

// import help functions
const getCircularReplacer = require('./utilities/circular-replacer');

// import controllers
const errorController = require('./controllers/error');
const mongoConnect = require('./utilities/database').mongoConnect;

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
    // // reach out to database and return user
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(error => console.log('app.js, get User error: ' + error));
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// if no page is found --> send to 404 page
app.use(errorController.get404);

mongoConnect(() => {
    // console.log('app.js | ' + JSON.stringify(client, getCircularReplacer()));
    app.listen(PORT);
})