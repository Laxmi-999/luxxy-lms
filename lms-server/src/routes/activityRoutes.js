import express from 'express';
import Activity from '../models/activity.js';
import { protect } from '../Middleware/authMiddleware.js';

const activityRouter = express.Router();

// Create activity (for both librarian and member)
activityRouter.post('/', protect, async (req, res) => {
  try {
    const { type, book, user } = req.body;

    if (!type || !book || !book._id || !book.title || !user || !user._id || !user.name) {
      return res.status(400).json({ message: 'Missing required activity fields' });
    }

    const activity = new Activity({
      type, // issued, returned, etc.
      book: {
        _id: book._id,
        title: book.title,
      },
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      librarian: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'Failed to create activity' });
  }
});

//getting activities
activityRouter.get('/', protect, async (req, res) => {
  try {
    let activities;

    if (req.user.role === 'librarian') {
      activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    } else {
      activities = await Activity.find({ 'user._id': req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);
    }

    if (!activities || activities.length === 0) {
      return res.status(404).json({ message: 'No recent activities found' });
    }

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Failed to fetch activities' });
  }
});
export default activityRouter;