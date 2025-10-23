// api/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Helper Function ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- Controller Functions ---
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please include all fields' });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({
      message: 'User registered successfully!',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        avatar: user.avatar,
        role: user.role // 👈 Make sure role is included
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        message: 'Login successful!',
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          avatar: user.avatar,
          role: user.role // 👈 Make sure role is included
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: req.file.path }, { new: true });
    // Also update the user object we send back to be complete
    const updatedUserObject = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
    };
    res.json({
      message: 'Avatar updated successfully',
      user: updatedUserObject
    });
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  uploadAvatar,
};