const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private (Admin/System)
const createNotification = asyncHandler(async (req, res) => {
  const { user, message, type, link } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Notification message is required');
  }

  const notification = await Notification.create({
    user,
    message,
    type,
    link,
  });

  res.status(201).json(notification);
});

// @desc    Get all notifications (public and user-specific)
// @route   GET /api/notifications
// @access  Public/Private
const getNotifications = asyncHandler(async (req, res) => {
  // If a user is authenticated, retrieve their specific notifications and general notifications
  let query = { user: null }; // Start with general notifications

  if (req.user) {
    query = { $or: [{ user: req.user._id }, { user: null }] };
  }
  
  const notifications = await Notification.find(query).sort({ createdAt: -1 });

  res.status(200).json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Ensure only the intended user or an admin can mark as read
  if (notification.user && notification.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to mark this notification as read');
  }

  notification.isRead = true;
  const updatedNotification = await notification.save();

  res.status(200).json(updatedNotification);
});

module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
};