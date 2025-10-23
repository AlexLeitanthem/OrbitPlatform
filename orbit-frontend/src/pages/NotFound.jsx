// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
    </Box>
  );
}
export default NotFound;