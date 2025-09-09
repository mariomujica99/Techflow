const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { exportTasksReport, exportUsersReport, exportComStationsReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/export/tasks', protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
router.get('/export/users', protect, adminOnly, exportUsersReport); // Export user-task report
router.get('/export/com-stations', protect, adminOnly, exportComStationsReport); // Export computer stations report

module.exports = router;