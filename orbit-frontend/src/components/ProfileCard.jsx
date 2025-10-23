// src/components/ProfileCard.jsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, Modal, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import ConnectButton from './ConnectButton.jsx';
import ChatWindow from './ChatWindow.jsx';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js';

const BACKEND_URL = 'http://localhost:5001';

function ProfileCard({ profile }) {
  const { user } = useAuth(); // Current user + token
  const [conversation, setConversation] = useState(null);
  const [openChat, setOpenChat] = useState(false);

  const startConversation = async () => {
    if (!user?.token) {
      console.error('User not logged in!');
      return;
    }

    try {
      // ✅ Include both the logged-in user and the target profile
      const res = await axios.post(
        `${BACKEND_URL}/api/conversations`,
        { participants: [user.user._id, profile.user._id] },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setConversation(res.data);
      setOpenChat(true);
    } catch (err) {
      console.error('Error starting conversation:', err.response?.data || err);
    }
  };

  const handleCloseChat = () => setOpenChat(false);

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={profile.user.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
            <Box>
              <Typography variant="h6">{profile.user.name}</Typography>
              <Typography color="textSecondary">{profile.status}</Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {profile.company && `at ${profile.company}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">{profile.location}</Typography>

          <Box sx={{ mt: 2 }}>
            {profile.skills.slice(0, 3).map((skill, index) => (
              <Chip key={index} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        </CardContent>

        <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button fullWidth variant="outlined" component={Link} to={`/profile/${profile.user._id}`}>
            View Profile
          </Button>
          <ConnectButton profile={profile} />
          <Button fullWidth variant="contained" color="primary" onClick={startConversation}>
            Message
          </Button>
        </Box>
      </Card>

      {/* Chat Modal */}
      <Modal open={openChat} onClose={handleCloseChat}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 500,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">{profile.user.name}</Typography>
            <IconButton size="small" onClick={handleCloseChat}>
              <CloseIcon />
            </IconButton>
          </Box>

          {conversation && (
            <ChatWindow
              conversation={conversation}
              updateConversation={() => {}}
              userId={user.user._id}
              token={user.token} // ✅ Pass token
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

export default ProfileCard;
