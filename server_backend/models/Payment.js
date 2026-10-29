const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  buyerEmail: { type: String, required: true },
  coins: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
