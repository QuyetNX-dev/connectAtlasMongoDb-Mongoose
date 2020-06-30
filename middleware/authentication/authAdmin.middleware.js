const db = require('../../db.js')
const userCol = require('../../models/users.model')
module.exports = async (req, res, next) => {

    if(!req.signedCookies.userId){
        next()
        return
    }
    const user = await userCol.findOne({_id: req.signedCookies.userId})
    if(!user){
        next()
        return
    }
    if(user.isAdmin === false){
        res.locals.userMember = user;
        next();
        return;
    }
    if(user.isAdmin === true){
        res.locals.userAdmin = user;
        next()
        return;
    }
    next()

}