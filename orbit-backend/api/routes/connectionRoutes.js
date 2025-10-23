// orbit-backend/api/routes/connectionRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  getPendingRequests, // 👈 IMPORT NEW FUNCTION
} = require('../controllers/connectionController');

// Send a connection request to a user
router.post('/request/:id', protect, sendConnectionRequest);

// Accept a pending connection request from a user
router.put('/accept/:id', protect, acceptConnectionRequest);

// Decline a pending connection request from a user
router.put('/decline/:id', protect, declineConnectionRequest);

// Remove an existing connection
router.delete('/remove/:id', protect, removeConnection);

// Get all pending connection requests for the current user
router.get('/requests', protect, getPendingRequests);

module.exports = router;
