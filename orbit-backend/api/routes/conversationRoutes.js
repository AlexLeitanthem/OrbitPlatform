// orbit-backend/api/routes/conversationRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createConversation, 
  getUserConversations 
} = require('../controllers/conversationController');

// Create a new conversation
router.post('/', protect, createConversation);

// Get all of the current user's conversations
router.get('/', protect, getUserConversations);

module.exports = router;