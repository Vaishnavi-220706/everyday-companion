// =============================================
// SERVER.JS - Main Entry Point
// Everyday Companion Backend
// =============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/authRoutes');
const deadlineRoutes = require('./routes/deadlineRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const foodRoutes = require('./routes/foodRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Import cron jobs for scheduled reminders
require('./jobs/reminderJobs');

const app = express();

// ---- MIDDLEWARE ----
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ---- DATABASE CONNECTION ----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ---- ROUTES ----
app.use('/api/auth', authRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/studyplans', studyPlanRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/appointments', appointmentRoutes);

// ---- ROOT HEALTH CHECK ----
app.get('/', (req, res) => {
  res.json({ message: 'Everyday Companion API is running 🚀' });
});

// ---- GLOBAL ERROR HANDLER ----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---- START SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
