// src/components/ProfileDetails.jsx
import React, { useState } from 'react';
import { Paper, Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function ProfileDetails({
  profile,
  onAddExperience,
  onAddEducation,
  onEditExperience,
  onEditEducation,
  onDeleteExperience,
  onDeleteEducation,
}) {
  const [tab, setTab] = useState(0);
  const handleTabChange = (e, newValue) => setTab(newValue);

  return (
    <Paper>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Bio" />
          <Tab label="Experience" />
          <Tab label="Education" />
          <Tab label="Skills" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">About</Typography>
          <Typography>{profile.bio || 'No bio provided.'}</Typography>
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Experience</Typography>
            <IconButton onClick={onAddExperience}><AddIcon /></IconButton>
          </Box>
          {profile.experience.map(exp => (
            <Box key={exp._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
              <Box>
                <Typography variant="h6">{exp.title} at {exp.company}</Typography>
                <Typography variant="body2" color="textSecondary">{new Date(exp.from).toLocaleDateString()} - {exp.to ? new Date(exp.to).toLocaleDateString() : 'Present'}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => onEditExperience(exp)}><EditIcon /></IconButton>
                <IconButton onClick={() => onDeleteExperience(exp._id)}><DeleteIcon /></IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {tab === 2 && (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Education</Typography>
            <IconButton onClick={onAddEducation}><AddIcon /></IconButton>
          </Box>
          {profile.education.map(edu => (
            <Box key={edu._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: '1px solid #eee', pb: 1 }}>
              <Box>
                <Typography variant="h6">{edu.school} - {edu.degree}</Typography>
                <Typography variant="body2" color="textSecondary">{edu.fieldofstudy}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => onEditEducation(edu)}><EditIcon /></IconButton>
                <IconButton onClick={() => onDeleteEducation(edu._id)}><DeleteIcon /></IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {tab === 3 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Skills</Typography>
        </Box>
      )}
    </Paper>
  );
}

export default ProfileDetails;
