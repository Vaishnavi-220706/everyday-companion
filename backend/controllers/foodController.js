// controllers/foodController.js
const FoodLog = require('../models/FoodLog');

// @route   GET /api/food/:date
// @desc    Get food log for a specific date (YYYY-MM-DD)
// @access  Private
const getFoodLog = async (req, res) => {
  try {
    let log = await FoodLog.findOne({ user: req.user.id, date: req.params.date });

    // If no log for today yet, return empty structure
    if (!log) {
      return res.json({
        date: req.params.date,
        breakfast: { eaten: false, notes: '', time: '' },
        lunch: { eaten: false, notes: '', time: '' },
        dinner: { eaten: false, notes: '', time: '' },
        waterGlasses: 0
      });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch food log.' });
  }
};

// @route   PUT /api/food/:date
// @desc    Update or create food log for a specific date
// @access  Private
const updateFoodLog = async (req, res) => {
  try {
    const { breakfast, lunch, dinner, waterGlasses } = req.body;

    const log = await FoodLog.findOneAndUpdate(
      { user: req.user.id, date: req.params.date },
      {
        user: req.user.id,
        date: req.params.date,
        ...(breakfast !== undefined && { breakfast }),
        ...(lunch !== undefined && { lunch }),
        ...(dinner !== undefined && { dinner }),
        ...(waterGlasses !== undefined && { waterGlasses })
      },
      { upsert: true, new: true }
    );

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update food log.' });
  }
};

// @route   GET /api/food/history
// @desc    Get last 7 days of food logs
// @access  Private
const getFoodHistory = async (req, res) => {
  try {
    const logs = await FoodLog.find({ user: req.user.id }).sort({ date: -1 }).limit(7);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch food history.' });
  }
};

module.exports = { getFoodLog, updateFoodLog, getFoodHistory };
