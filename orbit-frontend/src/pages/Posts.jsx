// src/pages/Posts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import PostItem from '../components/PostItem.jsx';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const getPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const body = JSON.stringify({ text });
      await axios.post('http://localhost:5001/api/posts', body, config);
      toast.success('Post created!');
      setText('');
      getPosts();
    } catch (err) {
      toast.error('Failed to create post.');
    }
  };
  
  // 👇 ADD THIS FUNCTION TO HANDLE DELETION
  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
    toast.success('Post deleted');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Community Feed</Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Create a Post</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">Submit</Button>
        </Box>
      </Paper>

      {loading ? <CircularProgress /> : (
        // 👇 THIS .map() BLOCK IS NOW CORRECT AND CLEAN 👇
        posts.map(post => (
          <PostItem 
            key={post._id} 
            post={post} 
            onPostDeleted={handlePostDeleted} // Pass the delete handler
          />
        ))
      )}
    </Container>
  );
}

export default Posts;