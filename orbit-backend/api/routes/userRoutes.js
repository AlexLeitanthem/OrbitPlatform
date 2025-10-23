const express = require('express');
const router = express.Router();

const { 
  registerUser, 
  loginUser, 
  getMe, 
  uploadAvatar 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const createUploader = require('../../config/cloudinary'); // dynamic uploader

// Create uploader specifically for avatars
const uploadAvatarUploader = createUploader('almalink-avatars');

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// PUT /avatar – upload profile picture
router.put(
  '/avatar',
  protect,
  uploadAvatarUploader.single('avatar'), // ✅ dynamic Cloudinary folder
  uploadAvatar
);

module.exports = router;
