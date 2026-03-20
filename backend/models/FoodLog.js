// models/FoodLog.js
const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  breakfast: {
    eaten: { type: Boolean, default: false },
    notes: { type: String, default: '', trim: true },
    time: { type: String, default: '' }
  },
  lunch: {
    eaten: { type: Boolean, default: false },
    notes: { type: String, default: '', trim: true },
    time: { type: String, default: '' }
  },
  dinner: {
    eaten: { type: Boolean, default: false },
    notes: { type: String, default: '', trim: true },
    time: { type: String, default: '' }
  },
  waterGlasses: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Each user can only have one log per day
foodLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('FoodLog', foodLogSchema);
