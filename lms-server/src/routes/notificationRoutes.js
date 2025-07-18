import express from 'express';
import { protect } from '../Middleware/authMiddleware.js';
import Notification from '../models/notification.js';


const notificationRouter = express.Router();

// GET /api/notifications/my-notifications
// Get all notifications for the logged-in user, sorted by newest first
notificationRouter.get('/my-notifications', protect, async (req, res) => {
  try {
    const userId = req.user._id; // User ID from the 'protect' middleware
    const notifications = await Notification.find({ user: userId })
                                            .sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// PUT /api/notifications/mark-read/:notificationId
// Mark a specific notification as read
notificationRouter.put('/mark-read/:notificationId', protect, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id; // User ID from the 'protect' middleware

    // Find and update the notification, ensuring it belongs to the logged-in user
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read.' });
  }
});

export default notificationRouter;
