// src/components/Header.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Box, Avatar, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People'; // Icon for My Network
import { useThemeContext } from '../context/ThemeContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import orbitLogo from '../assets/orbit-logo.png';

function Header() {
  const { mode, colorMode } = useThemeContext();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        top: 0, 
        zIndex: 1100, 
        boxShadow: 'none', 
        color: 'text.primary',
        // Background styling will be handled by the theme's MuiAppBar override
      }}
    >
      <Toolbar>
        <Box component={Link} to="/" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src={orbitLogo} alt="Orbit Logo" style={{ height: '40px' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ mr: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {user ? (
            <>
              {user.user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin/dashboard" startIcon={<AdminPanelSettingsIcon />}>
                  Admin
                </Button>
              )}
              <Button color="inherit" component={Link} to="/profiles" startIcon={<GroupIcon />}>
                Directory
              </Button>
              <Button color="inherit" component={Link} to="/posts" startIcon={<RssFeedIcon />}>
                Feed
              </Button>
              <Button color="inherit" component={Link} to="/dashboard" startIcon={<DashboardIcon />}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/my-network" startIcon={<PeopleIcon />}>
                My Network
              </Button>
              <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>
                Logout
              </Button>
              <Avatar
                src={user.user.avatar}
                alt={user.user.name}
                sx={{ ml: 2 }}
              />
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;