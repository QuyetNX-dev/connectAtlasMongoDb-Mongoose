const db = require('../../db.js');
const userCol = require('../../models/users.model')
module.exports.validateLogin = async (req, res, next) => {

    if(!req.signedCookies.userId){
        res.redirect('/login');
        return
    }
    const user = await userCol.findOne({_id: req.signedCookies.userId})
    if(!user){
        res.redirect('/login');
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
    }

}

module.exports.UnauthMember = (req, res, next) => {
    const userMember = res.locals.userMember
    if(!userMember){
      next();
      return
    }
    if(userMember.isAdmin === false){
        res.send('Bạn không có quyền truy cập')
        return
    }
}


module.exports.authAdmin = (req, res) => {

}