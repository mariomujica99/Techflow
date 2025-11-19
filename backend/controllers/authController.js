const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '14d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, profileColor, adminInviteToken, phoneNumber, pagerNumber, departmentInviteToken } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Department Invite Token Check
    if (!departmentInviteToken || departmentInviteToken !== process.env.DEPARTMENT_INVITE_TOKEN) {
      return res.status(401).json({ 
        message: 'Invalid Invite Token. Please try again or contact the admin for the code.' 
      });
    }

    // Determine user role: Admin if invite token is provided, otherwise Member
    let role = 'member';
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = 'admin';
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      profileColor,
      role,
      phoneNumber: phoneNumber || '',
      pagerNumber: pagerNumber || '',
    });

    // Return user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      profileColor: user.profileColor,
      phoneNumber: user.phoneNumber,
      pagerNumber: user.pagerNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data with JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      profileColor: user.profileColor,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete image file
const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract filename from URL (e.g., http://localhost:8000/uploads/filename.jpg)
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

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldImageUrl = user.profileImageUrl;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    user.pagerNumber = req.body.pagerNumber !== undefined ? req.body.pagerNumber : user.pagerNumber;
    
    // Handle profile image/color updates
    if (req.body.profileImageUrl !== undefined) {
      // User uploaded a new image - delete old one
      if (req.body.profileImageUrl && oldImageUrl && req.body.profileImageUrl !== oldImageUrl) {
        deleteImageFile(oldImageUrl);
      }
      // User switched to color - delete old image
      else if (req.body.profileImageUrl === null && oldImageUrl) {
        deleteImageFile(oldImageUrl);
      }
      user.profileImageUrl = req.body.profileImageUrl;
    }
    
    user.profileColor = req.body.profileColor !== undefined ? req.body.profileColor : user.profileColor;

    // Handle admin role upgrade
    if (req.body.adminInviteToken && req.body.adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
      user.role = 'admin';
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profileImageUrl: updatedUser.profileImageUrl,
      profileColor: updatedUser.profileColor,
      phoneNumber: updatedUser.phoneNumber,
      pagerNumber: updatedUser.pagerNumber,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Delete current user account
// @route DELETE /api/auth/profile
// @access Private
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile image if exists
    if (user.profileImageUrl) {
      deleteImageFile(user.profileImageUrl);
    }

    await user.deleteOne();
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount };