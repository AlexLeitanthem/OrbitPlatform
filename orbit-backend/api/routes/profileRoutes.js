// api/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteProfileAndUser,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');

// Get current user's profile
router.get('/me', protect, getMyProfile);

// Create or update profile
router.post('/', protect, createOrUpdateProfile);

// Get all profiles (supports pagination, filtering, search)
router.get('/', getAllProfiles); // ✅ Ensure user is populated in controller

// Get profile by user ID
router.get('/:user_id', getProfileByUserId);

// Delete profile & user
router.delete('/', protect, deleteProfileAndUser);

// Experience routes
router.put('/experience', protect, addExperience);
router.delete('/experience/:exp_id', protect, deleteExperience);

// Education routes
router.put('/education', protect, addEducation);
router.delete('/education/:edu_id', protect, deleteEducation);

module.exports = router;
