var express = require("express");
var router = express.Router();
var multer  = require('multer')

const controller = require('../../controller/book/book.controller')
const validate = require('../../validate/book.validate')
const middlewareLogin = require('../../middleware/authentication/login.middleware')
var upload = multer({ dest: './public/uploads/' })

router.get("/", controller.index);

router.get("/delete/:id", middlewareLogin.validateLogin, controller.delete);
  
router.get("/delete/:id/oke", middlewareLogin.validateLogin, controller.deleteOk);

router.get("/post", middlewareLogin.validateLogin, controller.post);

router.post("/post", middlewareLogin.validateLogin, upload.single('coverimage'), validate.validateBook, controller.postCreate);

router.get("/update/:id", middlewareLogin.validateLogin, controller.update);

router.post("/update/:id/done", middlewareLogin.validateLogin, controller.updateDone);

router.get('/update/cover-image/:id', middlewareLogin.validateLogin, controller.coverImage);

router.post('/update/cover-image/:id/done', middlewareLogin.validateLogin, upload.single('coverimage'), controller.postCoverImage);

router.get('/view/:id', controller.view)

router.get('/addToCart/:id', controller.addToCart)

module.exports = router