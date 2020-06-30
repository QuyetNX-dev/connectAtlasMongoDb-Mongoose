const shortid = require('shortid') 
const db = require('../db')
const sessionsCol = require('../models/sessions.model.js')
module.exports = async (req, res, next) => {
    if(!req.signedCookies.sessionId){
        const sessionId = shortid.generate()
        res.cookie('sessionId', sessionId, { signed: true })
        await sessionsCol.create({sessionId: sessionId})
    } 
   
    const userSession =  await sessionsCol.findOne({sessionId : req.signedCookies.sessionId})
    if(userSession.cart){
        res.locals.lengthCart = Object.keys(userSession.cart).length
    }
    
    next()
}

