var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    userId: String,
    bookId: String,
    stt: Number,
    isComplete: Boolean,
    count: Number
  });

var transactions = mongoose.model('transactions', transactionSchema);

module.exports = transactions;
