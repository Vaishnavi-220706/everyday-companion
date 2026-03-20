// controllers/studyPlanController.js
const StudyPlan = require('../models/StudyPlan');

// @route   GET /api/studyplans
// @desc    Get all study plans for user
// @access  Private
const getStudyPlans = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user.id }).sort({ planDate: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study plans.' });
  }
};

// @route   GET /api/studyplans/:date
// @desc    Get study plan for a specific date
// @access  Private
const getStudyPlanByDate = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ user: req.user.id, planDate: req.params.date });
    if (!plan) return res.status(404).json({ error: 'No plan for this date.' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan.' });
  }
};

// @route   POST /api/studyplans
// @desc    Create or replace study plan for a date
// @access  Private
const createStudyPlan = async (req, res) => {
  try {
    const { planDate, tasks, breakInterval, breakDuration } = req.body;
    if (!planDate || !tasks || tasks.length === 0) {
      return res.status(400).json({ error: 'Plan date and at least one task are required.' });
    }

    // Upsert: update if exists for that date, otherwise create
    const plan = await StudyPlan.findOneAndUpdate(
      { user: req.user.id, planDate },
      { tasks, breakInterval: breakInterval || 25, breakDuration: breakDuration || 5 },
      { upsert: true, new: true }
    );

    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save study plan.' });
  }
};

// @route   PUT /api/studyplans/:id/task/:taskId
// @desc    Mark a task as complete
// @access  Private
const toggleTask = async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user.id });
    if (!plan) return res.status(404).json({ error: 'Plan not found.' });

    const task = plan.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    task.completed = !task.completed;
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

// @route   DELETE /api/studyplans/:id
// @desc    Delete a study plan
// @access  Private
const deleteStudyPlan = async (req, res) => {
  try {
    await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Plan deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan.' });
  }
};

module.exports = { getStudyPlans, getStudyPlanByDate, createStudyPlan, toggleTask, deleteStudyPlan };
