import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper, Box, Avatar, CircularProgress, Grid, Chip, Button } from '@mui/material';
import ConnectButton from '../components/ConnectButton.jsx';
import ChatWindow from '../components/ChatWindow.jsx';

function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/profiles/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [id]);

  const startConversation = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/conversations', {
        participants: [profile.user._id],
      });
      setConversation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (!profile) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Profile not found.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header: Avatar, name, buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={profile.user?.avatar || ''} sx={{ width: 80, height: 80, mr: 2 }} />
            <Box>
              <Typography variant="h4">{profile.user?.name || 'Unnamed'}</Typography>
              <Typography variant="h6" color="textSecondary">
                {profile.status || 'Status not specified'} {profile.company && `at ${profile.company}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ConnectButton profile={profile} />
            <Button variant="contained" color="primary" onClick={startConversation}>
              Message
            </Button>
          </Box>
        </Box>

        {/* Location & Skills */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">{profile.location || 'Location not specified'}</Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {profile.skills?.map((skill, index) => (
              <Grid item key={index}>
                <Chip label={skill} size="small" />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Bio */}
        {profile.bio && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">About</Typography>
            <Typography variant="body2">{profile.bio}</Typography>
          </Box>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Education</Typography>
            {profile.education.map((edu, index) => (
              <Typography key={index} variant="body2">
                {edu.degree} at {edu.school} ({edu.from} - {edu.to || 'Present'})
              </Typography>
            ))}
          </Box>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Experience</Typography>
            {profile.experience.map((exp, index) => (
              <Typography key={index} variant="body2">
                {exp.title} at {exp.company} ({exp.from} - {exp.to || 'Present'})
              </Typography>
            ))}
          </Box>
        )}
      </Paper>

      {/* ChatWindow */}
      {conversation && (
        <Box sx={{ mt: 2, height: 400 }}>
          <ChatWindow conversation={conversation} updateConversation={() => {}} />
        </Box>
      )}
    </Container>
  );
}

export default ProfilePage;
