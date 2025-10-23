// src/components/ProfileSummaryCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, LinearProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth.js';

function ProfileSummaryCard({ profile }) {
  const { user } = useAuth();

  // Calculate profile completion percentage
  const calculateProfileStrength = () => {
    let score = 0;
    if (profile.status) score += 20;
    if (profile.bio) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.experience && profile.experience.length > 0) score += 20;
    if (profile.education && profile.education.length > 0) score += 20;
    return score;
  };

  const profileStrength = calculateProfileStrength();

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar src={user?.user?.avatar} sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
        <Typography variant="h5">{user?.user?.name}</Typography>
        <Typography color="textSecondary">{profile.status}</Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Profile Strength</Typography>
          <LinearProgress variant="determinate" value={profileStrength} />
          <Typography variant="caption" color="textSecondary">{profileStrength}% Complete</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProfileSummaryCard;