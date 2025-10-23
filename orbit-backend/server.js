// orbit-backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cloudinary = require('cloudinary').v2;
const connectDB = require('./config/db');

// Import all routes
const userRoutes = require('./api/routes/userRoutes');
const profileRoutes = require('./api/routes/profileRoutes');
const postRoutes = require('./api/routes/postRoutes');
const analyticsRoutes = require('./api/routes/analyticsRoutes');
const connectionRoutes = require('./api/routes/connectionRoutes');
const conversationRoutes = require('./api/routes/conversationRoutes');
const messageRoutes = require('./api/routes/messageRoutes');

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true 
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mount all routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('⚡ New user connected:', socket.id);

  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leaveRoom', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('sendMessage', (msg) => {
    io.to(msg.conversationId).emit('newMessage', msg);
  });

  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit('typing', { conversationId, isTyping });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});