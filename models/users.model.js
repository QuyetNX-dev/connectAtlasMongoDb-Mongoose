var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    avatarUrl: String,
    avatar: String,
    stt: Number,
    isAdmin: Boolean,
    wrongLoginCount: Number
  });

var User = mongoose.model('users', userSchema);

module.exports = User;
