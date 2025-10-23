// src/components/FilterSidebar.jsx
import React from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

function FilterSidebar({ filters, setFilters }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({ company: '', location: '' });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Filters</Typography>
      <TextField
        label="Company"
        name="company"
        value={filters.company}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Location"
        name="location"
        value={filters.location}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button onClick={clearFilters} variant="outlined" fullWidth>
        Clear Filters
      </Button>
    </Paper>
  );
}
export default FilterSidebar;