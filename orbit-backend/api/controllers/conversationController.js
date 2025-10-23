// orbit-backend/api/controllers/conversationController.js

const Conversation = require('../models/conversationModel');

// @desc    Create new conversation
// @route   POST /api/conversations
// @access  Private
const createConversation = async (req, res) => {
  const participants = [req.user.id, ...req.body.participants];

  if (!participants || participants.length < 2) {
    return res.status(400).json({ message: 'At least 2 participants required' });
  }

  try {
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = await Conversation.create({ participants });
    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

// @desc    Get all conversations for logged-in user
// @route   GET /api/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate('participants', 'name avatar email')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
};