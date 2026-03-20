// routes/medicineRoutes.js
const express = require('express');
const router = express.Router();
const { getMedicines, createMedicine, updateMedicine, deleteMedicine } = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

module.exports = router;
