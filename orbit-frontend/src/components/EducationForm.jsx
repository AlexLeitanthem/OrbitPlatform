import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import toast from 'react-hot-toast';

function EducationForm({ onUpdate, data }) {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        school: data.school || '',
        degree: data.degree || '',
        fieldofstudy: data.fieldofstudy || '',
        from: data.from ? data.from.slice(0, 10) : '',
        to: data.to ? data.to.slice(0, 10) : '',
      });
    }
  }, [data]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      if (!token) return toast.error('Authentication token missing.');

      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      };

      if (data?._id) {
        await axios.put(`http://localhost:5001/api/profiles/education/${data._id}`, formData, config);
        toast.success('Education updated!');
      } else {
        await axios.put('http://localhost:5001/api/profiles/education', formData, config);
        toast.success('Education added!');
      }

      if (onUpdate) onUpdate();
      if (!data?._id) setFormData({ school: '', degree: '', fieldofstudy: '', from: '', to: '' });
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to save education.');
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {data ? 'Edit Education' : 'Add New Education'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField name="school" label="* School" fullWidth value={formData.school} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="degree" label="* Degree" fullWidth value={formData.degree} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="fieldofstudy" label="* Field of Study" fullWidth value={formData.fieldofstudy} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="from" label="* From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.from} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="to" label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.to} onChange={onChange} />
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {data ? 'Update Education' : 'Add Education'}
      </Button>
    </Box>
  );
}

export default EducationForm;
