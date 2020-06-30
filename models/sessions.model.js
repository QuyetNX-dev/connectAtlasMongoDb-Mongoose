var mongoose = require('mongoose');
// let productId = req.params.id;
var sessionSchema = new mongoose.Schema({
  sessionId: String,
  cart:{
    // productId: Number
  },
});

var sessions = mongoose.model('sessions', sessionSchema);

module.exports = sessions;
