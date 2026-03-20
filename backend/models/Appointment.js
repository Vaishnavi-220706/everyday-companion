// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Appointment title is required'],
    trim: true
  },
  doctorName: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
