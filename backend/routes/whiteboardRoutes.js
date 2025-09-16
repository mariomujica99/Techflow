const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getWhiteboard, updateWhiteboard } = require('../controllers/whiteboardController');

const router = express.Router();

router.get('/', protect, getWhiteboard);
router.put('/', protect, updateWhiteboard);

module.exports = router;