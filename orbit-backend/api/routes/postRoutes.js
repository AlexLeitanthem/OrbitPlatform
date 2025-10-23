// api/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPost, getAllPosts, likePost, createComment, deletePost, deleteComment } = require('../controllers/postController');

router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.put('/like/:id', protect, likePost);
router.post('/comment/:id', protect, createComment);
router.delete('/:id', protect, deletePost);
router.delete('/comment/:id/:comment_id', protect, deleteComment);

module.exports = router;