const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  workerEmail: { type: String, required: true },
  workerName: { type: String, required: true },
  withdrawalCoin: { type: Number, required: true },
  withdrawalAmount: { type: Number, required: true },
  paymentSystem: { type: String, enum: ['stripe', 'bkash', 'rocket', 'nagad'], required: true },
  accountNumber: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  withdrawalDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
