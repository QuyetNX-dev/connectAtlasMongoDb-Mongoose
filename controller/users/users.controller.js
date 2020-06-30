require('dotenv').config();
const shortid = require('shortid')
const db = require('../../db');
const  cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const usersCol = require('../../models/users.model.js');
const transactionsCol = require('../../models/transactions.model.js')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

module.exports.index = async function(req, res) {
    const page = parseInt(req.query.page) || 1;
    // const users = db.get("users").value();
    const users = await usersCol.find();
    const perPage = 3;
    const perPagination = 3;

    if((users.length) % perPage !== 0){
        var totalPages = Math.floor((users.length) / perPage) + 1;
    }else{
        var totalPages = users.length / perPage
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
        
        if(users.length === 0){
          return arr
        }

        return arr.slice(itemSlicePagination[0], itemSlicePagination[1])
    }

    const collectionPages = spreadOut(totalPages);

    const pagination = indexPagination(perPagination, collectionPages, page);

    const start = (page - 1) * perPage;
    const end = page * perPage;

    users.forEach(async (item, index) => {
        await usersCol.updateOne({_id: item._id}, {stt: index +1})   
    })

    res.render("users/index", {
        users: users.slice(start, end),
        titleHeader: 'Danh sách khách hàng',
        activeUsers: 'text-primary',
        page,
        totalPages,
        pagination
    });
}

module.exports.delete = (req, res) => {
    let id = req.params.id;
    res.render("users/delete", {
        id
    });
}

module.exports.deleteOk = async (req, res) => {
    var id = req.params.id;
    await usersCol.deleteOne({_id: id})
    await transactionsCol.deleteOne({_id: id})
    res.redirect("/users");
}

module.exports.create =  (req, res) => {
    res.render("users/post", {});
}

module.exports.postCreate = async (req, res) => {
    req.body.avatarUrl = "https://res.cloudinary.com/dd052ipmr/image/upload/v1589794813/ldrprjmt2tcsg6kgoeyl.png";
    req.body.avatar = "";
    if(req.file){
        await cloudinary.uploader.upload(req.file.path, function(err, result){
            req.body.avatarUrl = result.url
            req.body.avatar = req.file.path.split('/').slice(1).join('/')
        })
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);      

    req.body.id = shortid.generate();
    req.body.isAdmin = true;
    req.body.wrongLoginCount = 0;
    let stt = (await usersCol.find()).length + 1;

    await usersCol.create({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        avatarUrl: req.body.avatarUrl,
        avatar: req.body.avatar,
        stt: stt,
        isAdmin: true,
        wrongLoginCount: 0
    })
    
    res.redirect("/users");
}

module.exports.update = async (req, res) => {
    let id = req.params.id;
    const isUser = await usersCol.findOne({_id: id})
    res.render("users/update", {
        id, isUser
    });
}

module.exports.updateDone = (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    bcrypt.hash(req.body.password, 10, async function(err, hash) {
        await usersCol.updateOne(
            {_id: id},
            { 
                name: name,
                phone: req.body.phone,
                email: req.body.email,
                password: hash
            })
        res.redirect("/users");
    });
}

module.exports.updateAvatar =async (req, res) => {
    const id = req.params.id;
    const isUser = await usersCol.findOne({_id: id})
    res.render('users/updateAvatar', {
        isUser
    })

}

module.exports.postUpdateAvatar = async (req, res) => {
    const id = req.params.id;
    var avatarFile = "";
    var avatarUrl = "https://res.cloudinary.com/dd052ipmr/image/upload/v1589794813/ldrprjmt2tcsg6kgoeyl.png"; 

        if(req.file){
            const resultUrl =  await cloudinary.uploader.upload(req.file.path)
            avatarFile = req.file.path.split('/').slice(1).join('/');
            avatarUrl = resultUrl.url 
        }
        
        await usersCol.updateOne(
            {_id: id},
            {
                avatar: avatarFile,
                avatarUrl: avatarUrl
            }
        )

        res.redirect('/users/update/' + id)

}