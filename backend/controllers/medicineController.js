// controllers/medicineController.js
const Medicine = require('../models/Medicine');

const getMedicines = async (req, res) => {
  try {
    const meds = await Medicine.find({ user: req.user.id, active: true }).sort({ reminderTime: 1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines.' });
  }
};

const createMedicine = async (req, res) => {
  try {
    const { medicineName, dosage, reminderTime, frequency, sendEmail } = req.body;
    if (!medicineName || !reminderTime) {
      return res.status(400).json({ error: 'Medicine name and reminder time are required.' });
    }

    const med = await Medicine.create({
      user: req.user.id,
      medicineName,
      dosage: dosage || '',
      reminderTime,
      frequency: frequency || 'daily',
      sendEmail: sendEmail || false
    });

    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create medicine reminder.' });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const med = await Medicine.findOne({ _id: req.params.id, user: req.user.id });
    if (!med) return res.status(404).json({ error: 'Medicine not found.' });

    const fields = ['medicineName', 'dosage', 'reminderTime', 'frequency', 'sendEmail', 'active'];
    fields.forEach(f => { if (req.body[f] !== undefined) med[f] = req.body[f]; });

    await med.save();
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update medicine.' });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Medicine reminder deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete medicine.' });
  }
};

module.exports = { getMedicines, createMedicine, updateMedicine, deleteMedicine };
