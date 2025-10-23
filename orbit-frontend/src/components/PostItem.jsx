// src/components/PostItem.jsx

import React, { useState, useRef } from 'react';
import { Paper, Typography, Box, IconButton, TextField, Button, Avatar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';
import toast from 'react-hot-toast';

function PostItem({ post, onPostDeleted }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const commentInputRef = useRef(null);

  const isLiked = user ? likes.some(like => like.user === user.user.id) : false;

  const handleLike = async () => {
    if (!user) return toast.error('You must be logged in to like a post.');
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`http://localhost:5001/api/posts/like/${post._id}`, {}, config);
      setLikes(res.data);
    } catch (err) {
      toast.error('Failed to update like.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in to comment.');
    if (commentText.trim() === '') return;
    try {
      const token = user.token;
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const res = await axios.post(`http://localhost:5001/api/posts/comment/${post._id}`, { text: commentText }, config);
      setComments(res.data);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment.');
    }
  };
  
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = user.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5001/api/posts/${post._id}`, config);
        onPostDeleted(post._id);
      } catch (err) {
        toast.error('Failed to delete post.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`http://localhost:5001/api/posts/comment/${post._id}/${commentId}`, config);
      setComments(res.data);
      toast.success('Comment deleted.');
    } catch (err) {
      toast.error('Failed to delete comment.');
    }
  };
  
  const focusCommentInput = () => {
    commentInputRef.current.focus();
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* 👇 ADDED POSTER'S AVATAR 👇 */}
          <Avatar src={post.user?.avatar} sx={{ mr: 2 }} />
          <Typography variant="h6">{post.name}</Typography>
        </Box>
        {user && user.user.id === post.user?._id && (
          <IconButton onClick={handleDeletePost} size="small" title="Delete Post"><DeleteIcon /></IconButton>
        )}
      </Box>

      <Typography sx={{ mb: 2, mt: 1, whiteSpace: 'pre-wrap' }}>{post.text}</Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', borderTop: '1px solid #eee', pt: 1 }}>
        <IconButton size="small" onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
          <ThumbUpIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>{likes.length}</Typography>
        <IconButton size="small" onClick={focusCommentInput}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography variant="body2">{comments.length}</Typography>
      </Box>
      
      <Box sx={{ mt: 2, borderTop: '1px solid #eee', pt: 2 }}>
        <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', mb: 2 }}>
          <TextField
            inputRef={commentInputRef}
            size="small"
            fullWidth
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" size="small" variant="contained" sx={{ ml: 1 }}>Post</Button>
        </Box>
        {comments.map(comment => (
          <Box key={comment._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, '&:hover .delete-comment': { opacity: 1 } }}>
            {/* 👇 ADDED COMMENTER'S AVATAR 👇 */}
            <Avatar src={comment.user?.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" component="div">{comment.name}</Typography>
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
              {(user && (user.user.id === post.user?._id || user.user.id === comment.user?._id)) && (
                <IconButton onClick={() => handleDeleteComment(comment._id)} size="small" title="Delete Comment" className="delete-comment" sx={{ opacity: 0 }}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default PostItem;