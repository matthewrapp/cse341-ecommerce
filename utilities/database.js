// set up the code that will allow us to connect to MongoDB

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://matthewrapp:GK2uY8VGgnCKYKwf@cluster0.hw43b.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected to MongoDB!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log('MondoDB Error Handling: ' + err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;