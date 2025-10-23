// src/pages/AlumniDirectory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  Pagination,
  Button,
  Stack,
  Chip,
  Grow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ProfileCard from '../components/ProfileCard.jsx';
import ProfileSkeleton from '../components/ProfileSkeleton.jsx';
import FilterDrawer from '../components/FilterDrawer.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useAuth } from '../hooks/useAuth.js';

const BACKEND_URL = 'http://localhost:5001';

const suggestions = {
  companies: ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple'],
  locations: ['San Francisco', 'New York', 'Seattle', 'London', 'Berlin'],
  skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
};

const sortFields = [
  { label: 'Name', value: 'user.name' },
  { label: 'Company', value: 'company' },
  { label: 'Location', value: 'location' },
  { label: 'Status', value: 'status' },
];

function AlumniDirectory() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ company: '', location: '', skills: [] });
  const [activeFilters, setActiveFilters] = useState({ company: '', location: '', skills: [] });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [sortField, setSortField] = useState('user.name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [conversation, setConversation] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedFilters = useDebounce(activeFilters, 500);

  const getProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (debouncedFilters.company) params.append('company', debouncedFilters.company);
      if (debouncedFilters.location) params.append('location', debouncedFilters.location);
      if (debouncedFilters.skills.length) params.append('skills', debouncedFilters.skills.join(','));
      if (sortField) params.append('sortField', sortField);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const res = await axios.get(`${BACKEND_URL}/api/profiles?${params.toString()}`);
      setProfiles(res.data.profiles);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setProfiles([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, debouncedFilters, sortField, sortOrder]);

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  const applyFilters = useCallback((newFilters) => {
    setActiveFilters(newFilters);
    setDrawerOpen(false);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const toggleSortOrder = () => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));

  const startConversation = async (profileId) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/conversations`, {
        participants: [profileId],
      });
      setConversation(res.data);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  return (
    <Container maxWidth="xl">
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        availableSkills={suggestions.skills}
      />

      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ my: 4 }}>
        <Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setDrawerOpen(true)}>
          Filters
        </Button>
        <TextField
          fullWidth
          label="Search by Name, Status, Company or Location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortField} label="Sort By" onChange={(e) => setSortField(e.target.value)}>
            {sortFields.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
          </Select>
        </FormControl>
        <IconButton onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
      </Stack>

      {/* Profiles Grid */}
      <Grid container spacing={4}>
        {loading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4} lg={3}><ProfileSkeleton /></Grid>
            ))
          : profiles.length > 0
          ? profiles.map((profile, idx) => (
              <Grow in={!loading} key={profile._id} style={{ transformOrigin: '0 0 0' }} {...{ timeout: (idx + 1) * 150 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <ProfileCard
                    profile={profile}
                    currentUserId={user?._id}
                    onMessage={() => startConversation(profile.user._id)}
                  />
                </Grid>
              </Grow>
            ))
          : (
            <Grid item xs={12}>
              <Typography>No profiles match your criteria.</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Try popular:</Typography>
                {suggestions.companies.map(c => <Chip key={c} label={c} size="small" onClick={() => applyFilters({ ...activeFilters, company: c })} />)}
                {suggestions.locations.map(l => <Chip key={l} label={l} size="small" onClick={() => applyFilters({ ...activeFilters, location: l })} />)}
                {suggestions.skills.map(s => <Chip key={s} label={s} size="small" onClick={() => applyFilters({ ...activeFilters, skills: [s] })} />)}
              </Stack>
            </Grid>
          )}
      </Grid>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, py: 2 }}>
          <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}

      {/* Chat Window Modal */}
      {conversation && user && (
        <Box sx={{ mt: 4, height: 500 }}>
          <ChatWindow
            conversation={conversation}
            updateConversation={() => {}}
            userId={user._id}
          />
        </Box>
      )}
    </Container>
  );
}

export default AlumniDirectory;
