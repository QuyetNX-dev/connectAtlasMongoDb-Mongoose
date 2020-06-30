var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    coverImage: String,
    stt: Number,
  });

var books = mongoose.model('books', bookSchema);

module.exports = books;
