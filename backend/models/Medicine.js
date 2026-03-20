// models/Medicine.js
const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  dosage: {
    type: String,
    trim: true,
    default: ''
  },
  reminderTime: {
    type: String, // e.g. "08:00", "14:30"
    required: [true, 'Reminder time is required']
  },
  frequency: {
    type: String,
    enum: ['daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed'],
    default: 'daily'
  },
  sendEmail: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
