// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const { getFoodLog, updateFoodLog, getFoodHistory } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/history', getFoodHistory);
router.get('/:date', getFoodLog);
router.put('/:date', updateFoodLog);

module.exports = router;
