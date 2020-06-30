module.exports.home = (req, res, next) => {
    res.locals.routehome = "home";
    next()
}

module.exports.book = (req, res, next) => {
    res.locals.routebook = "book";
    next()
}

module.exports.user = (req, res, next) => {
    res.locals.routeuser = "user";
    next()
}

module.exports.transaction = (req, res, next) => {
    res.locals.routetransaction = "transaction";
    next()
}

module.exports.cart = (req, res, next) => {
    res.locals.routebasket = "basket";
    next()
}
