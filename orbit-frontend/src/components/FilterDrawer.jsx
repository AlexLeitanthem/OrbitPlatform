// src/components/FilterDrawer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Box, Typography, TextField, Button, Divider, Stack, Autocomplete, Chip } from '@mui/material';

function FilterDrawer({ open, onClose, filters, setFilters, applyFilters, availableSkills = [] }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync localFilters with props.filters when drawer opens or filters change externally
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  // Debounce applying filters
  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters(localFilters);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [localFilters, applyFilters]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
    setFilters(prev => ({ ...prev, [name]: value }));
  }, [setFilters]);

  const handleSkillsChange = useCallback((event, newSkills) => {
    setLocalFilters(prev => ({ ...prev, skills: newSkills }));
    setFilters(prev => ({ ...prev, skills: newSkills }));
  }, [setFilters]);

  const handleClear = useCallback(() => {
    const cleared = { company: '', location: '', skills: [] };
    setLocalFilters(cleared);
    setFilters(cleared);
    applyFilters(cleared);
  }, [setFilters, applyFilters]);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Advanced Filters
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <TextField
            label="Company"
            name="company"
            value={localFilters.company}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ 'aria-label': 'Filter by company' }}
          />
          <TextField
            label="Location"
            name="location"
            value={localFilters.location}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ 'aria-label': 'Filter by location' }}
          />
          <Autocomplete
            multiple
            freeSolo
            options={availableSkills}
            value={localFilters.skills || []}
            onChange={handleSkillsChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={option} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Skills"
                placeholder="Add skills"
                size="small"
              />
            )}
          />
          <Button
            onClick={() => applyFilters(localFilters)}
            variant="contained"
            fullWidth
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleClear}
            variant="text"
            fullWidth
          >
            Clear
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}

FilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    company: PropTypes.string,
    location: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  applyFilters: PropTypes.func.isRequired,
  availableSkills: PropTypes.arrayOf(PropTypes.string), // optional predefined skill list
};

export default React.memo(FilterDrawer);
