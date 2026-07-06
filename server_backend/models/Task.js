const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  detail: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  buyerName: { type: String, required: true },
  payableAmount: { type: Number, required: true },
  requiredWorkers: { type: Number, required: true },
  completionDate: { type: Date, required: true },
  submissionInfo: { type: String, required: true },
  taskImageUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  totalPayable: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
