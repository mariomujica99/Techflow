const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUserAccount } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Authentication routes
router.post("/register", registerUser); // Register a User
router.post("/login", loginUser); // Login a User
router.get("/profile", protect, getUserProfile); // Get User Profile
router.put("/profile", protect, updateUserProfile); // Update User Profile
router.delete("/profile", protect, deleteUserAccount); // Delete User Profile

router.post("/upload-profile-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  
  const imageUrl = req.file.path; // Cloudinary URL
  const cloudinaryId = req.file.filename; // Cloudinary public_id
  
  res.json({ 
    imageUrl: imageUrl,
    filename: cloudinaryId // Send filename for potential cleanup
  });
});

module.exports = router;