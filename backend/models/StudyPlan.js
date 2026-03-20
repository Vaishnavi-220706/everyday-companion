// models/StudyPlan.js
const mongoose = require('mongoose');

const studyTaskSchema = new mongoose.Schema({
  subject: { type: String, required: true, trim: true },
  duration: { type: Number, required: true }, // in minutes
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  completed: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planDate: {
    type: String, // stored as YYYY-MM-DD
    required: true
  },
  breakInterval: {
    type: Number,
    default: 25 // minutes of study before a break (Pomodoro style)
  },
  breakDuration: {
    type: Number,
    default: 5 // break length in minutes
  },
  tasks: [studyTaskSchema]
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
