// routes/studyPlanRoutes.js
const express = require('express');
const router = express.Router();
const { getStudyPlans, getStudyPlanByDate, createStudyPlan, toggleTask, deleteStudyPlan } = require('../controllers/studyPlanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getStudyPlans);
router.get('/:date', getStudyPlanByDate);
router.post('/', createStudyPlan);
router.put('/:id/task/:taskId', toggleTask);
router.delete('/:id', deleteStudyPlan);

module.exports = router;
