const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const axios = require('axios');

// Create or update profile
const createOrUpdateProfile = async (req, res) => {
  const { company, location, status, skills, bio, linkedin, twitter } = req.body;
  const profileFields = { user: req.user._id, company, status, bio, location };

  // Geocoding
  if (location) {
    try {
      const geoRes = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_API_KEY}&query=${location}`);
      if (geoRes.data?.data?.length > 0) {
        profileFields.locationCoords = {
          latitude: geoRes.data.data[0].latitude,
          longitude: geoRes.data.data[0].longitude,
        };
      }
    } catch (err) {
      console.error('Geocoding failed:', err.message);
    }
  }

  // Skills
  if (skills) {
    profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => skill.trim());
  }

  // Social links
  profileFields.social = { linkedin, twitter };

  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, upsert: true }
    ).populate('user', 'name avatar'); // ✅ populate user info
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get current user's profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name avatar');
    if (!profile) return res.status(400).json({ msg: 'No profile found for this user' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all profiles (with filters, search, pagination)
const getAllProfiles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'user.name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const profileQuery = {};
    if (req.query.status) profileQuery.status = { $regex: req.query.status, $options: 'i' };
    if (req.query.company) profileQuery.company = { $regex: req.query.company, $options: 'i' };
    if (req.query.location) profileQuery.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.skills) {
      profileQuery.skills = { $in: req.query.skills.split(',').map(skill => new RegExp(skill.trim(), 'i')) };
    }

    const aggregationPipeline = [
      { $match: profileQuery },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0 } } // ✅ hide password
    ];

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      aggregationPipeline.push({
        $match: {
          $or: [
            { 'user.name': searchRegex },
            { status: searchRegex },
            { company: searchRegex },
            { location: searchRegex },
            { skills: searchRegex },
          ],
        },
      });
    }

    // Count total
    const countPipeline = [...aggregationPipeline, { $count: 'total' }];
    const countResult = await Profile.aggregate(countPipeline);
    const count = countResult.length > 0 ? countResult[0].total : 0;

    // Pagination + sorting
    aggregationPipeline.push({ $sort: { [sortField]: sortOrder } });
    aggregationPipeline.push({ $skip: (page - 1) * limit });
    aggregationPipeline.push({ $limit: limit });

    const profiles = await Profile.aggregate(aggregationPipeline);

    res.json({
      profiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get profile by user ID
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', 'name avatar');
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete profile & user
const deleteProfileAndUser = async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user._id });
    await User.findByIdAndRemove(req.user._id);
    res.json({ msg: 'User and profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Experience
const addExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.experience.unshift({ ...req.body });
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Education
const addEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.education.unshift({ ...req.body });
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const deleteEducation = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    profile.education = profile.education.filter(edu => edu._id.toString() !== req.params.edu_id);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteProfileAndUser,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
};
