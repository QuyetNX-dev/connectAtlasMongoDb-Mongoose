const db = require('../../db');
const shortid = require('shortid');
const sessionsCol = require('../../models/sessions.model.js');
const booksCol = require('../../models/books.model.js')
const usersCol = require('../../models/users.model.js')
const transactionsCol = require('../../models/transactions.model.js')
var _ = require('lodash');

module.exports.index = async (req, res) => {
    const sessionId =  req.signedCookies.sessionId;
    // const cart = db.get('session').find({id: sessionId}).value().cart;
    const cart = (await sessionsCol.findOne({sessionId : sessionId})).cart;
    // const books = db.get('todo').value();
    // console.log(cart)
    const books = await booksCol.find()
    // console.log(books)
    var cartBooks = []
    for(let bookId in cart){
        let book = books.find(item => {
            return item.id === bookId
        }) 
        // console.log(book)
        // console.log(cart[bookId])
        // var test = {count: cart[bookId]}
        // var demo = Object.assign(test, book)
        // console.log(demo)
        cartBooks.push(Object.assign({count: cart[bookId]}, book))
    }
    // console.log(cartBooks)
    // res.locals.lengthCart = 0;
    res.render('cart/index.pug', {
        carts:  cartBooks
    })
}

module.exports.transaction = async (req, res) => {
    const sessionId = req.signedCookies.sessionId;
    // const cart = db.get('session').find({id: sessionId}).value().cart;
    const cart = (await sessionsCol.findOne({sessionId})).cart;
    // const userId = db.get('users').find({id: req.signedCookies.userId}).value().id
    const userId = (await usersCol.findOne({_id: req.signedCookies.userId}))._id
    for(let bookId in cart){
        // db.get('transection').push({
        //     userId: userId,
        //     bookId: bookId,
        //     id: shortid.generate(),
        //     stt: db.get("transection").value().length + 1,
        //     isComplete: false,
        //     count: cart[bookId]
        // }).write()
        await transactionsCol.create({
            userId: userId,
            bookId: bookId,
            isComplete: false,
            count: cart[bookId]
        })
    }
    res.redirect('/transection')
}

module.exports.reduce = async (req, res) => {
    const productId = req.params.id
    const sessionId = req.signedCookies.sessionId;
    const products = await sessionsCol.findOne({sessionId: sessionId})

    const count = products.cart[productId]
    if(count >= 2){
        products.set("cart." + productId, count - 1)
        await products.save()
    }
    if(count <= 1){
        products.set('cart.'+ productId, undefined, {strict: false} );
        await products.save()
    }

    res.redirect('/cart')
    
}

module.exports.incremate = async (req, res) => {
    const productId = req.params.id
    const sessionId = req.signedCookies.sessionId;

    const products = await sessionsCol.findOne({sessionId: sessionId})
    const count = products.cart[productId]

    products.set("cart." + productId, count + 1)
    await products.save()

    res.redirect('/cart')
}