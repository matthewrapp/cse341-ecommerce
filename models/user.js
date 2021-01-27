// // user model

// import mongoose
const mongoose = require('mongoose');

// constructor
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    }
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// // import mongoDb
// const mongodb = require('mongodb');

// // imports
// const getDb = require('../utilities/database').getDb;

// // helper utilities
// const getCircularReplacer = require('../utilities/circular-replacer');

// // global variables
// const ObjectId = mongodb.ObjectId;
// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // object { items: [] }
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//             .then(user => {
//                 console.log('user.js, User Returned: ' + JSON.stringify(user, getCircularReplacer()))
//             })
//             .catch(err => console.log('user.js | save() method, Error Handling: ' + err));
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity
//             })
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         }
//         const db = getDb();
//         return db.collection('users').updateOne({
//             _id: new ObjectId(this._id)
//         }, {
//             $set: {
//                 cart: updatedCart
//             }
//         });
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(item => {
//             return item.productId;
//         });
//         return db
//             .collection('products')
//             .find({
//                 _id: {
//                     $in: productIds
//                 }
//             })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err => console.log('user.js | getCart() method, Error Handling: ' + err));
//     }

//     deleteItemFromCart(prodId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== prodId.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({
//             _id: new ObjectId(this._id)
//         }, {
//             $set: {
//                 cart: {
//                     items: updatedCartItems
//                 }
//             }
//         });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order)
//             })
//             .then(result => {
//                 this.cart = {
//                     items: []
//                 }
//                 return db.collection('users').updateOne({
//                     _id: new ObjectId(this._id)
//                 }, {
//                     $set: {
//                         cart: {
//                             items: []
//                         }
//                     }
//                 });
//             })
//             .catch(err => console.log('user.js | addOrder() method, Error Handling: ' + err))

//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders')
//             .find({
//                 'user._id': new ObjectId('60105a09f967051ba5484ffc')
//             })
//             .toArray();
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').find({
//                 _id: new ObjectId(userId)
//             })
//             .next()
//             .catch(err => console.log('user.js | findById() method, Error Handling: ' + err));
//     }
// }

// module.exports = User;