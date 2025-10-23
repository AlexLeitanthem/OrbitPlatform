// src/components/DashboardSidebar.jsx
import React from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import { Link } from 'react-router-dom';

function DashboardSidebar() {
  return (
    <Paper sx={{ width: 240, p: 1 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/experience">
            <ListItemIcon><WorkIcon /></ListItemIcon>
            <ListItemText primary="My Experience" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/education">
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="My Education" />
          </ListItemButton>
        </ListItem>

        {/* Messages Link */}
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/messages">
            <ListItemIcon><ChatIcon /></ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard/settings">
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
}

export default DashboardSidebar;
