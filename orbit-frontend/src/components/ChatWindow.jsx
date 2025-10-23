// src/components/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, TextField, IconButton, Badge, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5001';

function ChatWindow({ conversation, updateConversation, userId, token }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);

  const otherParticipant = conversation?.participants.find(p => p._id !== userId);

  // Effect to manage socket connection and listeners
  useEffect(() => {
    if (!conversation || !token) return;

    // Connect to the socket server
    socketRef.current = io(BACKEND_URL);
    const socket = socketRef.current;
    
    socket.emit('joinRoom', conversation._id);

    // Set up the listener for incoming messages
    const messageListener = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('newMessage', messageListener);

    const typingListener = ({ conversationId, isTyping }) => {
      if (conversationId === conversation._id) {
        setTyping(isTyping);
      }
    };
    socket.on('typing', typingListener);

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/messages/${conversation._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    // 👇 THIS IS THE FIX for the dual sending bug 👇
    // This cleanup function runs when the component unmounts or dependencies change
    return () => {
      socket.off('newMessage', messageListener); // Remove the specific listener
      socket.off('typing', typingListener);
      socket.emit('leaveRoom', conversation._id);
      socket.disconnect();
    };
  }, [conversation, token]);

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId: conversation._id, isTyping: true });
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('typing', { conversationId: conversation._id, isTyping: false });
      }
    }, 1000);
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !file) || !socketRef.current) return;
    const formData = new FormData();
    formData.append('text', newMessage);
    if (file) formData.append('file', file);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/messages/${conversation._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
      );
      const msg = res.data;
      socketRef.current.emit('sendMessage', msg);
      setMessages((prev) => [...prev, msg]);
      updateConversation({ ...conversation, lastMessage: msg.text || '📎 Attachment' });
      setNewMessage('');
      setFile(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <Avatar src={otherParticipant?.avatar} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">{otherParticipant?.name}</Typography>
          {typing && <Typography variant="caption" color="text.secondary">Typing...</Typography>}
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        {messages.map((msg) => (
          <Box
            key={msg._id}
            sx={{
              display: 'flex',
              // 👇 THIS IS THE FIX for left/right alignment 👇
              justifyContent: msg.sender._id === userId ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: msg.sender._id === userId ? 'primary.main' : 'grey.300',
                color: msg.sender._id === userId ? 'white' : 'black',
                px: 2, py: 1, borderRadius: 2, maxWidth: '70%', wordBreak: 'break-word',
              }}
            >
              {msg.file && (
                <Box sx={{ mb: 1 }}>
                  <img src={msg.file} alt="attachment" style={{ maxWidth: '100%', borderRadius: 8 }} />
                </Box>
              )}
              <Typography variant="body2">{msg.text}</Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7 }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ddd', alignItems: 'center' }}>
        <Button component="label" sx={{ mr: 1 }}>
          <AttachFileIcon />
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatWindow;