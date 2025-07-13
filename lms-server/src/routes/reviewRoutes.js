import express from 'express';
import Review from '../models/review.js';
import multer from 'multer';
import path from 'path'

const reviewRouter = express.Router();

// GET all reviews
reviewRouter.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});




// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder must exist
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Review creation route with file upload
reviewRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, rating, text, role } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!name || !rating || !text) {
      return res.status(400).json({ message: 'Name, rating, and text are required' });
    }

    const newReview = new Review({ name, image, rating, text, role });
    await newReview.save();

    return res.status(201).json({ review: newReview });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create review' });
  }
});

export default reviewRouter;
