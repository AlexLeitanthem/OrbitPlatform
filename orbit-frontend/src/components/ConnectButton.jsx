// src/components/ConnectButton.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';

function ConnectButton({ profile }) {
  const { user, refreshUser } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('none');

  // Set initial connection status when user or profile changes
  useEffect(() => {
    if (user && profile) {
      const conn = user.user.connections?.find(
        (c) => c.user === profile.user._id
      );
      setConnectionStatus(conn ? conn.status : 'none');
    }
  }, [user, profile]);

  // Handle all connection actions: connect, accept, remove
  const handleAction = async (action) => {
    try {
      const token = user?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Optimistically update UI
      if (action === 'connect') setConnectionStatus('requested');
      if (action === 'accept') setConnectionStatus('accepted');
      if (action === 'remove') setConnectionStatus('none');

      // Call backend API based on action
      if (action === 'connect') {
        await axios.post(
          `http://localhost:5001/api/connections/request/${profile.user._id}`,
          {},
          config
        );
        toast.success('Connection request sent!');
      } else if (action === 'accept') {
        await axios.put(
          `http://localhost:5001/api/connections/accept/${profile.user._id}`,
          {},
          config
        );
        toast.success('Connection accepted!');
      } else if (action === 'remove') {
        await axios.delete(
          `http://localhost:5001/api/connections/remove/${profile.user._id}`,
          config
        );
        toast.success('Connection removed.');
      }

      // Refresh global user state after API call
      await refreshUser();
    } catch (err) {
      toast.error('Action failed.');
      console.error(err);

      // Rollback optimistic UI if API fails
      if (action === 'connect') setConnectionStatus('none');
      if (action === 'accept') setConnectionStatus('pending');
      if (action === 'remove') setConnectionStatus('accepted');
    }
  };

  // Don’t show button on your own profile
  if (!user || user.user._id === profile.user._id) return null;

  // Render button based on connection status
  switch (connectionStatus) {
    case 'pending':
      return (
        <Button
          variant="contained"
          onClick={() => handleAction('accept')}
        >
          Accept Request
        </Button>
      );
    case 'requested':
      return (
        <Button
          variant="outlined"
          onClick={() => handleAction('remove')}
        >
          Cancel Request
        </Button>
      );
    case 'accepted':
      return (
        <Button
          variant="outlined"
          onClick={() => handleAction('remove')}
        >
          Remove Connection
        </Button>
      );
    default:
      return (
        <Button
          variant="contained"
          onClick={() => handleAction('connect')}
        >
          Connect
        </Button>
      );
  }
}

export default ConnectButton;
