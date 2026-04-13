const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true },   // stored as "YYYY-MM-DD"
  time: { type: String, required: true },   // stored as "HH:MM"
  location: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
