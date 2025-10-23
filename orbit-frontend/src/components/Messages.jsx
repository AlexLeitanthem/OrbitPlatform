// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import ConversationList from '../components/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import axios from 'axios';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const userId = localStorage.getItem('userId'); // Replace with your auth context if needed

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/api/conversations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setConversations(res.data);
        if (res.data.length) setSelectedConversation(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

  // Update conversation after sending a message
  const handleUpdateConversation = (updatedConv) => {
    setConversations((prev) =>
      prev.map((conv) => (conv._id === updatedConv._id ? updatedConv : conv))
    );
    setSelectedConversation(updatedConv);
  };

  return (
    <Grid container spacing={2} sx={{ height: '85vh' }}>
      {/* Left Sidebar */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: '100%', overflow: 'auto' }}>
          <ConversationList
            conversations={conversations}
            onSelect={setSelectedConversation}
            selected={selectedConversation}
            userId={userId}
          />
        </Paper>
      </Grid>

      {/* Chat Window */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              updateConversation={handleUpdateConversation}
              userId={userId}
            />
          ) : (
            <p style={{ margin: 'auto', color: '#666' }}>Select a conversation</p>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Messages;
