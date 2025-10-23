// src/components/ProfileSkeleton.jsx
import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

function ProfileSkeleton() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
          <Box>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </Box>
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} sx={{ mr: 0.5, display: 'inline-block' }} />
          <Skeleton variant="rounded" width={60} height={24} sx={{ mr: 0.5, display: 'inline-block' }} />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Skeleton variant="rounded" width="100%" height={36} />
      </Box>
    </Card>
  );
}
export default ProfileSkeleton;