const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardData, getUserDashboardData, getTasks, getAllTasksForEveryone, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require('../controllers/taskController');


const router = express.Router();

// Task Management Routes
router.get('/dashboard-data', protect, getDashboardData);
router.get('/user-dashboard-data', protect, getUserDashboardData);
router.get('/', protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get('/all', getAllTasksForEveryone); // Get all tasks
router.get('/:id', protect, getTaskById); // Get task by ID
router.post('/', protect, createTask); // Create a task
router.put('/:id', protect, updateTask); // Update a task
router.delete('/:id', protect, deleteTask); // Delete a task
router.put('/:id/status', protect, updateTaskStatus); // Update task status
router.put('/:id/todo', protect, updateTaskChecklist); // Update task checklist

module.exports = router;