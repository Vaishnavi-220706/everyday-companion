// jobs/reminderJobs.js
// =============================================
// SCHEDULED REMINDER JOBS (node-cron)
// Runs in background when server starts
// =============================================

const cron = require('node-cron');
const Deadline = require('../models/Deadline');
const Medicine = require('../models/Medicine');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendEmail } = require('../config/mailer');

// =============================================
// JOB 1: DEADLINE REMINDERS
// Runs every day at 8:00 AM
// Sends email for deadlines due within 2 days
// =============================================
cron.schedule('0 8 * * *', async () => {
  console.log('📅 Running deadline reminder job...');
  try {
    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);
    twoDaysLater.setHours(23, 59, 59, 999);

    // Find upcoming deadlines that haven't had a reminder sent yet
    const upcomingDeadlines = await Deadline.find({
      dueDate: { $gte: now, $lte: twoDaysLater },
      reminderSent: false,
      completed: false
    }).populate('user', 'email name');

    for (const deadline of upcomingDeadlines) {
      const daysLeft = Math.ceil((new Date(deadline.dueDate) - now) / (1000 * 60 * 60 * 24));
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
          <h2 style="color: #e74c3c;">⚠️ Deadline Reminder!</h2>
          <p>Hi <strong>${deadline.user.name}</strong>,</p>
          <p>Your deadline is approaching:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Task:</td><td style="padding: 8px;">${deadline.taskName}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${deadline.subject}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Due Date:</td><td style="padding: 8px;">${new Date(deadline.dueDate).toDateString()}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Days Left:</td><td style="padding: 8px; color: #e74c3c;">${daysLeft} day(s)</td></tr>
          </table>
          <p style="margin-top: 20px;">Stay on track! Open <strong>Everyday Companion</strong> to review your tasks.</p>
        </div>
      `;

      await sendEmail(deadline.user.email, `📚 Deadline Reminder: ${deadline.taskName}`, html);
      deadline.reminderSent = true;
      await deadline.save();
    }

    console.log(`✅ Deadline reminders sent: ${upcomingDeadlines.length}`);
  } catch (err) {
    console.error('❌ Deadline reminder job error:', err.message);
  }
});

// =============================================
// JOB 2: MEDICINE REMINDERS
// Runs every minute and checks if any medicine
// has a reminder time matching current time
// =============================================
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const medicines = await Medicine.find({
      reminderTime: currentTime,
      active: true,
      sendEmail: true
    }).populate('user', 'email name');

    for (const med of medicines) {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff3cd;">
          <h2 style="color: #856404;">💊 Medicine Reminder</h2>
          <p>Dear <strong>${med.user.name}</strong>,</p>
          <p>It's time to take your medicine:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Medicine:</td><td style="padding: 8px; font-size: 18px;">${med.medicineName}</td></tr>
            ${med.dosage ? `<tr><td style="padding: 8px; font-weight: bold;">Dosage:</td><td style="padding: 8px;">${med.dosage}</td></tr>` : ''}
            <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${med.reminderTime}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Frequency:</td><td style="padding: 8px;">${med.frequency.replace('_', ' ')}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 16px;">Please take your medicine now. Stay healthy! 💙</p>
        </div>
      `;

      await sendEmail(med.user.email, `💊 Medicine Time: ${med.medicineName}`, html);
    }

    if (medicines.length > 0) {
      console.log(`💊 Medicine reminders sent at ${currentTime}: ${medicines.length}`);
    }
  } catch (err) {
    console.error('❌ Medicine reminder job error:', err.message);
  }
});

// =============================================
// JOB 3: APPOINTMENT REMINDERS
// Runs every day at 7:00 AM
// Sends email for appointments within 24 hours
// =============================================
cron.schedule('0 7 * * *', async () => {
  console.log('🏥 Running appointment reminder job...');
  try {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const upcomingAppts = await Appointment.find({
      appointmentDate: { $gte: now, $lte: tomorrow },
      reminderSent: false,
      completed: false
    }).populate('user', 'email name');

    for (const appt of upcomingAppts) {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #d1ecf1;">
          <h2 style="color: #0c5460;">🏥 Appointment Reminder</h2>
          <p>Dear <strong>${appt.user.name}</strong>,</p>
          <p>You have an upcoming appointment:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold;">Appointment:</td><td style="padding: 8px;">${appt.title}</td></tr>
            ${appt.doctorName ? `<tr><td style="padding: 8px; font-weight: bold;">Doctor:</td><td style="padding: 8px;">Dr. ${appt.doctorName}</td></tr>` : ''}
            ${appt.location ? `<tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${appt.location}</td></tr>` : ''}
            <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${new Date(appt.appointmentDate).toLocaleString()}</td></tr>
            ${appt.notes ? `<tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${appt.notes}</td></tr>` : ''}
          </table>
          <p style="margin-top: 20px;">Please prepare accordingly. Take care! 💙</p>
        </div>
      `;

      await sendEmail(appt.user.email, `🏥 Appointment Tomorrow: ${appt.title}`, html);
      appt.reminderSent = true;
      await appt.save();
    }

    console.log(`✅ Appointment reminders sent: ${upcomingAppts.length}`);
  } catch (err) {
    console.error('❌ Appointment reminder job error:', err.message);
  }
});

console.log('⏰ All reminder cron jobs scheduled.');
