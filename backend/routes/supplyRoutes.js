const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getSupplies, updateSupplies } = require('../controllers/supplyController');

const router = express.Router();

router.get('/', protect, getSupplies);
router.put('/:storageRoom', protect, updateSupplies);

module.exports = router;