const express = require('express');
const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, authorizeRoles('admin'), createNotification) // Only admins can create notifications
  .get(protect, getNotifications); // Authenticated users can get notifications

router.route('/:id/read').put(protect, markNotificationAsRead);

module.exports = router;