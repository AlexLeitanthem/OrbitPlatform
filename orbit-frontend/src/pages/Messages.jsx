// src/pages/Messages.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import axios from 'axios';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Fetch conversations from backend
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

  return (
    <Grid container spacing={2} sx={{ height: '85vh' }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ height: '100%', overflow: 'auto' }}>
          <ConversationList
            conversations={conversations}
            selected={selectedConversation?.id}
            onSelect={setSelectedConversation}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              conversations={conversations}
              setConversations={setConversations}
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
