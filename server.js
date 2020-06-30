require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8080;
const md5 = require('md5');
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://quety:Quety123@cluster0-bjwbo.gcp.mongodb.net/libraryQuety?retryWrites=true&w=majority', { useUnifiedTopology: true , useNewUrlParser: true});

const db = require("./db.js");
const controller = require('./controller/library.controller.js')
const userRouter = require('./routes/users/users.route.js')
const bookRouter = require('./routes/book/book.route.js')
const transectionRoute = require("./routes/transection/index.route.js");
const loginRouter = require('./routes/login/login.route')
const middlewareLogin = require('./middleware/authentication/login.middleware')
const middlewareSession = require('./middleware/session.middleware.js')
const middlewareAdmin = require('./middleware/authentication/authAdmin.middleware')
const checkRouterMiddleware = require('./middleware/checkRoute.middleware')
const cartRouter = require('./routes/cart/cart.route.js')

const app = express();
app.set("view engine", "pug"); 
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECSION_SECRET));

app.use(express.static('public'));


app.get("/", checkRouterMiddleware.home, middlewareLogin.validateLogin, controller.server);


app.use(middlewareSession)

app.use('/login',loginRouter);

app.use("/transection", checkRouterMiddleware.transaction, middlewareLogin.validateLogin, transectionRoute);

app.use('/book', checkRouterMiddleware.book, middlewareAdmin, bookRouter);

app.use("/users", checkRouterMiddleware.user, middlewareLogin.validateLogin, middlewareLogin.UnauthMember, userRouter);

app.use("/cart", checkRouterMiddleware.cart, middlewareAdmin, cartRouter)

app.listen(PORT, () => {
  console.log("Service running on PORT:" + PORT);
});


