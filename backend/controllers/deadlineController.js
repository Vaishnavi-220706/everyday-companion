// controllers/deadlineController.js
const Deadline = require('../models/Deadline');

// @route   GET /api/deadlines
// @desc    Get all deadlines for logged-in user, sorted by dueDate
// @access  Private
const getDeadlines = async (req, res) => {
  try {
    const deadlines = await Deadline.find({ user: req.user.id })
      .sort({ dueDate: 1 }); // ascending: soonest first
    res.json(deadlines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deadlines.' });
  }
};

// @route   POST /api/deadlines
// @desc    Create a new deadline
// @access  Private
const createDeadline = async (req, res) => {
  try {
    const { taskName, subject, dueDate } = req.body;
    if (!taskName || !subject || !dueDate) {
      return res.status(400).json({ error: 'Task name, subject, and due date are required.' });
    }

    const deadline = await Deadline.create({
      user: req.user.id,
      taskName,
      subject,
      dueDate: new Date(dueDate)
    });

    res.status(201).json(deadline);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create deadline.' });
  }
};

// @route   PUT /api/deadlines/:id
// @desc    Update a deadline (e.g., mark complete)
// @access  Private
const updateDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findOne({ _id: req.params.id, user: req.user.id });
    if (!deadline) return res.status(404).json({ error: 'Deadline not found.' });

    const { taskName, subject, dueDate, completed } = req.body;
    if (taskName !== undefined) deadline.taskName = taskName;
    if (subject !== undefined) deadline.subject = subject;
    if (dueDate !== undefined) deadline.dueDate = new Date(dueDate);
    if (completed !== undefined) deadline.completed = completed;

    await deadline.save();
    res.json(deadline);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update deadline.' });
  }
};

// @route   DELETE /api/deadlines/:id
// @desc    Delete a deadline
// @access  Private
const deleteDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deadline) return res.status(404).json({ error: 'Deadline not found.' });
    res.json({ message: 'Deadline deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete deadline.' });
  }
};

module.exports = { getDeadlines, createDeadline, updateDeadline, deleteDeadline };
