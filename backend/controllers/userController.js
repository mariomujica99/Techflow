const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path')

// Demo account emails that have restricted access
const DEMO_EMAILS = ['userdemo@gmail.com', 'admindemo@gmail.com'];

// Helper function to check if user is a demo account
const isDemoAccount = (email) => DEMO_EMAILS.includes(email);

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['member', 'admin'] } }).select('-password');

    // Add Task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'Pending' 
        });
        const inProgressTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'In Progress' 
        });
        const completedTasks = await Task.countDocuments({ 
          assignedTo: user._id, 
          status: 'Completed' 
        });

        return {
          ...user._doc, // Include all existing user data
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
  );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Delete image file
const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const filename = imageUrl.split('/uploads/')[1];
    if (filename) {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
  }
};

// @desc Delete a user (Admin only)
// @route DELETE /api/users/:id
// @access Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if current user is a demo account
    if (isDemoAccount(req.user.email)) {
      return res.status(403).json({ 
        message: 'Demo accounts cannot delete users.' 
      });
    }
    // Delete profile image if exists
    if (user.profileImageUrl) {
      deleteImageFile(user.profileImageUrl);
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser };