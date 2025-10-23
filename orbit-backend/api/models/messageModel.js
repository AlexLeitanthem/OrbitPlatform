// orbit-backend/api/models/messageModel.js

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    file: { type: String }, // Cloudinary URL
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message; // Use module.exports