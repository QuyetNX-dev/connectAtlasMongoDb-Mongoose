var express = require('express')
var router = express.Router()
var loginMiddleware = require('../../middleware/authentication/login.middleware')
const controller = require('../../controller/cart/cart.controller')
router.get('/', controller.index)
router.get('/reduce/:id', controller.reduce)
router.get('/incremate/:id', controller.incremate)
router.get('/transaction',loginMiddleware.validateLogin, controller.transaction)

module.exports = router