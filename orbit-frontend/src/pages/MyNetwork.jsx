// src/pages/MyNetwork.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button, Avatar } from '@mui/material';
import { useAuth } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

function MyNetwork() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5001/api/connections/requests', config);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const handleAccept = async (id) => {
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5001/api/connections/accept/${id}`, {}, config);
      toast.success('Connection accepted!');
      fetchRequests(); // Refresh the list
    } catch (err) {
      toast.error('Failed to accept request.');
    }
  };

  const handleDecline = async (id) => {
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Note: We use the remove endpoint to decline
      await axios.delete(`http://localhost:5001/api/connections/remove/${id}`, config);
      toast.success('Request declined.');
      fetchRequests(); // Refresh the list
    } catch (err) {
      toast.error('Failed to decline request.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>My Network</Typography>
        <Typography variant="h6" gutterBottom>
          {requests.length} Pending Invitation{requests.length !== 1 && 's'}
        </Typography>
        
        {requests.length > 0 ? (
          requests.map(req => (
            <Box key={req._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
              <Box component={Link} to={`/profile/${req.user._id}`} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <Avatar src={req.user.avatar} sx={{ mr: 2 }} />
                <Typography>{req.user.name}</Typography>
              </Box>
              <Box>
                <Button variant="outlined" sx={{ mr: 1 }} onClick={() => handleDecline(req.user._id)}>Decline</Button>
                <Button variant="contained" onClick={() => handleAccept(req.user._id)}>Accept</Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No pending invitations.</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default MyNetwork;