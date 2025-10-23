const express = require('express');
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const { protect } = require('../middleware/authMiddleware');
const createUploader = require('../../config/cloudinary');

const router = express.Router();
const upload = createUploader('orbit-messages'); // dynamic folder for chat

// GET all messages for a conversation
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new message (text + optional file)
router.post('/:conversationId', protect, upload.single('file'), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file ? req.file.path : null;

    const message = await Message.create({
      conversationId: req.params.conversationId,
      sender: req.user._id,
      text,
      file,
    });

    // Update last message in conversation
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text || req.file?.originalname,
      updatedAt: Date.now(),
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
