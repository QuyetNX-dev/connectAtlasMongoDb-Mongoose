const shortid = require('shortid')
var _ = require('lodash');

const db = require('../../db')
const booksCol = require('../../models/books.model.js')
const sessionsCol = require('../../models/sessions.model.js')
const mongoose = require('mongoose')
module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    // const books = db.get("todo").value();
    const books = await booksCol.find()

    const perPage = 8;
    const perPagination = 3;
    const start = (page - 1) * perPage;
    const end = page * perPage;

    if((books.length) % perPage !== 0){
        var totalPages = Math.floor((books.length) / perPage) + 1;
    }else{
        var totalPages = books.length / perPage
    }

    function spreadOut(x){
        var arr=[];
        for(let i = 1; i <= x; i++ ){
            arr.push(i)
        }
        return arr
    }

    function indexPagination(x,arr,index){
        let slicePagination = [];

        if(arr.length % x !== 0){
            var n = Math.floor((arr.length) / x) + 1;
        }else{
            var n = arr.length / x
        }
 
        for(let i = 1; i <= n; i++){
            var start = (i-1) * x;
            var end = (i-1) * x + x;
            slicePagination.push([start,end]) 
        }

        let itemSlicePagination = slicePagination.find(item => {
            return item[0] <= index && item[1] >= index
        })
        
        if(books.length === 0){
          return arr
        }

        return arr.slice(itemSlicePagination[0], itemSlicePagination[1])
    }

    const collectionPages = spreadOut(totalPages);

    const pagination = indexPagination(perPagination, collectionPages, page);

    books.forEach(async (item, index) => {
        await booksCol.updateOne({_id: item._id}, {stt: index +1})   
    })

    res.render("book/index", {
        todos: books.slice(start, end),
        page,
        totalPages,
        collectionPages,
        pagination

    })
}

module.exports.delete = (req, res) => {
    let id = req.params.id;
    res.render("book/delete", {
        id
    });
};

module.exports.deleteOk = async (req, res) => {
    var id = req.params.id;
    
    await booksCol.remove({_id : id})
    db.get("transection")
        .remove({ bookId: id })
        .write();
    res.redirect("/book");
};

module.exports.post = (req, res) => {
    res.render("book/post", {});
};

module.exports.postCreate = async (req, res) => {
    req.body.coverImage = '/uploads/f3f74f32d9d91fe191f7befd5f06e3e1'
    if(req.file){
        req.body.coverImage = "/" + req.file.path.split('/').slice(1).join('/');
    }
    // req.body.id = shortid.generate();
    req.body.stt = (await booksCol.find()).length + 1;

    await booksCol.create(req.body)
    res.redirect('/book')
}

module.exports.update =async (req, res) => {
    let id = req.params.id;
    let isBook = await booksCol.findOne({_id: id})
    res.render("book/update", {
        id,
        isBook,
        title: isBook.title,
        description: isBook.description
    });
}

module.exports.updateDone = async (req, res) => {
    let id = req.params.id;
    let title = req.body.title;
    let description = req.body.description;

    await booksCol.updateOne({_id: id},{title,description})
    res.redirect("/book");
}

module.exports.coverImage = (req, res) => {
    let id = req.params.id;
    res.render('book/update-cover-image', {
        id
    })
}

module.exports.postCoverImage = async (req, res) => {
    let id = req.params.id;
    coverImage = '/uploads/f3f74f32d9d91fe191f7befd5f06e3e1';
    if(req.file){
        coverImage = "/" + req.file.path.split('/').slice(1).join('/');
    }
    await booksCol.updateOne({_id: id},{coverImage})
    res.redirect("/book/update/" + id);
        
}

module.exports.view = async (req, res) => {
    let id = req.params.id;
    let isBook = await booksCol.findOne({_id: id})
    res.render('book/viewBook', {
        isBook
    })
}

module.exports.addToCart = async (req, res) => {
    let productId = req.params.id;
    const sessionId = req.signedCookies.sessionId; 
    
    const products = await sessionsCol.findOne({sessionId: sessionId})
   
    const count = _.get(products, 'cart.' + productId, 0)
    products.set("cart." + productId, count + 1)
    
    await products.save()

    

    res.redirect('/book')
}