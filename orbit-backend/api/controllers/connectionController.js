// orbit-backend/api/controllers/connectionController.js

const User = require('../models/userModel');

// Helper: remove connection between two users
const removeConnectionBetweenUsers = async (userA, userB) => {
  userA.connections = userA.connections.filter(conn => !conn.user.equals(userB._id));
  userB.connections = userB.connections.filter(conn => !conn.user.equals(userA._id));
  await userA.save();
  await userB.save();
};

// @desc    Send a connection request
// @route   POST /api/connections/request/:id
// @access  Private
const sendConnectionRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.user.id);
    const receiver = await User.findById(req.params.id);

    if (!receiver || req.user.id === req.params.id) {
      return res.status(404).json({ msg: 'User not found or cannot connect with yourself' });
    }

    const alreadyConnected =
      sender.connections.some(conn => conn.user.equals(receiver._id)) ||
      receiver.connections.some(conn => conn.user.equals(sender._id));

    if (alreadyConnected) {
      return res.status(400).json({ msg: 'Connection request already sent or exists' });
    }

    sender.connections.push({ user: receiver._id, status: 'requested' });
    receiver.connections.push({ user: sender._id, status: 'pending' });

    await sender.save();
    await receiver.save();

    res.json({ msg: 'Connection request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Accept a connection request
// @route   PUT /api/connections/accept/:id
// @access  Private
const acceptConnectionRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requestingUser = await User.findById(req.params.id);

    const pendingConnection = currentUser.connections.find(
      conn => conn.user.equals(requestingUser._id) && conn.status === 'pending'
    );

    if (!pendingConnection) {
      return res.status(400).json({ msg: 'No pending request from this user' });
    }

    pendingConnection.status = 'accepted';

    const requestedConnection = requestingUser.connections.find(
      conn => conn.user.equals(currentUser._id) && conn.status === 'requested'
    );

    if (requestedConnection) {
      requestedConnection.status = 'accepted';
      await requestingUser.save();
    }

    await currentUser.save();

    res.json({ msg: 'Connection accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Decline a connection request
// @route   PUT /api/connections/decline/:id
// @access  Private
const declineConnectionRequest = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const requestingUser = await User.findById(req.params.id);

    await removeConnectionBetweenUsers(currentUser, requestingUser);

    res.json({ msg: 'Connection request declined' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove a connection
// @route   DELETE /api/connections/remove/:id
// @access  Private
const removeConnection = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(req.params.id);

    await removeConnectionBetweenUsers(currentUser, otherUser);

    res.json({ msg: 'Connection removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 👇 ADD THIS FUNCTION
// @desc    Get pending connection requests for the current user
// @route   GET /api/connections/requests
// @access  Private
const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'connections',
        match: { status: 'pending' }, // Only get pending requests
        populate: {
          path: 'user',
          select: 'name avatar' // Populate the user details for each request
        }
      });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Filter out any nulls from the populated array
    const pendingRequests = user.connections.filter(conn => conn.status === 'pending');

    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 👇 EXPORT ALL FUNCTIONS
module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  getPendingRequests,
};
