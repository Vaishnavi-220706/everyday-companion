// models/Deadline.js
const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskName: {
    type: String,
    required: [true, 'Task name is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  // Track if email reminder has been sent (to avoid duplicates)
  reminderSent: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Deadline', deadlineSchema);
