// routes/deadlineRoutes.js
const express = require('express');
const router = express.Router();
const { getDeadlines, createDeadline, updateDeadline, deleteDeadline } = require('../controllers/deadlineController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // all routes protected

router.get('/', getDeadlines);
router.post('/', createDeadline);
router.put('/:id', updateDeadline);
router.delete('/:id', deleteDeadline);

module.exports = router;
