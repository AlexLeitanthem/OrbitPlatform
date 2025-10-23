// api/controllers/analyticsController.js
const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const Post = require('../models/postModel');

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalPosts = await Post.countDocuments();

    const profilesByLocation = await Profile.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalProfiles,
      totalPosts,
      profilesByLocation,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
module.exports = { getAnalytics };