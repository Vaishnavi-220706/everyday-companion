// controllers/appointmentController.js
const Appointment = require('../models/Appointment');

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments.' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { title, doctorName, location, appointmentDate, notes } = req.body;
    if (!title || !appointmentDate) {
      return res.status(400).json({ error: 'Title and appointment date are required.' });
    }

    const appt = await Appointment.create({
      user: req.user.id,
      title,
      doctorName: doctorName || '',
      location: location || '',
      appointmentDate: new Date(appointmentDate),
      notes: notes || ''
    });

    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment.' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, user: req.user.id });
    if (!appt) return res.status(404).json({ error: 'Appointment not found.' });

    const fields = ['title', 'doctorName', 'location', 'appointmentDate', 'notes', 'completed'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        appt[f] = f === 'appointmentDate' ? new Date(req.body[f]) : req.body[f];
      }
    });

    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment.' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Appointment deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete appointment.' });
  }
};

module.exports = { getAppointments, createAppointment, updateAppointment, deleteAppointment };
