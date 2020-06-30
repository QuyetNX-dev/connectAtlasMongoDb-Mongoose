const db = require('../../db')
const shortid = require('shortid')
const transactionsCol = require('../../models/transactions.model.js')
const booksCol = require('../../models/books.model.js')
const usersCol = require('../../models/users.model.js')

module.exports.index = async (req, res) => {
    const userMember = res.locals.userMember;
    var transactions = await transactionsCol.find()
    transactions.forEach(async (item, index) => {
        await transactionsCol.updateOne({_id: item._id}, {stt: index +1})   
    })
    var collectionTransection = await Promise.all(transactions.map( async (item, index) => {
        let bookTransection =await booksCol.findOne({_id: item.bookId});
        let title = bookTransection.title;
        let userTransection =await usersCol.findOne({_id: item.userId});
        let name = userTransection.name; 
        let obj = {
            stt: index + 1,
            id: item.id,
            userId: item.userId,
            bookId: item.bookId,
            isComplete: item.isComplete,
            title: title,
            name: name
        };
        return obj;
    }));

    if(userMember){
        collectionTransection = collectionTransection.filter((item, index) => {
            if(item.userId === userMember.id){
                item.stt = index 
            }
            return item.userId === userMember.id
        })
        for(let i = 0; i < collectionTransection.length; i++){
            collectionTransection[i].stt = i + 1
        }
    }
    res.render("transection/index", {
        collectionTransection,
        titleHeader:'Kê khai giao dịch',
        activeTransection: 'text-primary'
    });
}

module.exports.delete =async (req, res) => {
    var id = req.params.id;
    await transactionsCol.deleteOne({_id: id})
    res.redirect("back");
}

module.exports.create = async (req, res) => {
    let users = await usersCol.find()
    const books = await booksCol.find()
    const userMember = res.locals.userMember;
    if(userMember){
      users = users.filter(item => {
        return item.id === userMember.id  
      })
    }
    res.render("transection/create", {
        users,
        books
    });
}

module.exports.postCreate = async (req, res) => {

    req.body.stt = (await transactionsCol.find()).length + 1;
    req.body.isComplete = false;
    await transactionsCol.create(req.body)
    res.redirect("/transection");
}

module.exports.isComplete = (req, res) => {
    res.render('transection/isComplete/isComplete',{
        id: req.params.id 
    })
}

module.exports.updateComplete = async (req, res) => {
    const id = req.params.id
    await transactionsCol.updateOne({_id: id},{isComplete: true})
    res.redirect('/transection')
}