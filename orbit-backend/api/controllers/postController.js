// api/controllers/postController.js
const Post = require('../models/postModel');
const User = require('../models/userModel');

// Create a post
const createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      user: req.user.id
    });
    const post = await newPost.save();
    // To ensure the avatar is present on a new post, we re-fetch it
    const populatedPost = await Post.findById(post._id).populate('user', ['name', 'avatar']);
    res.json(populatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ date: -1 })
      .populate('user', ['name', 'avatar'])
      .populate('comments.user', ['name', 'avatar']);
    res.json(posts);
  } catch (err) {
    // 👇 THIS CATCH BLOCK WAS MISSING 👇
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.some(like => like.user.toString() === req.user.id)) {
      post.likes = post.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );
    } else {
      post.likes.unshift({ user: req.user.id });
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      name: user.name,
      user: req.user.id
    };
    post.comments.unshift(newComment);
    await post.save();
    // Return all comments, populated with user data
    const populatedPost = await Post.findById(post._id).populate('comments.user', ['name', 'avatar']);
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.comments = post.comments.filter(({ id }) => id !== req.params.comment_id);
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('comments.user', ['name', 'avatar']);
    res.json(populatedPost.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { createPost, getAllPosts, likePost, createComment, deletePost, deleteComment };