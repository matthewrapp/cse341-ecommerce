const path = require('path');

// mainModule == the main js file (app.js) 
module.exports = path.dirname(process.mainModule.filename);