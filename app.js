// core modules import
const path = require('path');

// Third party packages
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// import controllers
const errorController = require('./controllers/error');

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

// consider routes in admin.js
////    funnel all admin things into this file/route
app.use('/admin', adminRoutes);
// consider routes in shops.js
////    funnel all shop things into this file/route
app.use(shopRoutes);

// if no page is found --> send to 404 page
app.use(errorController.get404);

// application listens to server via express.js
app.listen(PORT);