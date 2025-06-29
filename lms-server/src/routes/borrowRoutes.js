
import express from 'express';
import Book from '../models/book.js';
import { isLibrarian, protect } from '../Middleware/authMiddleware.js';
import Borrow from '../models/borrow.js';
import { isMember } from '../Middleware/authMiddleware.js';



const borrowRouter = express.Router();



borrowRouter.post('/request', protect,isMember,  async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; 

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing' });
    }

    const newRequest = await Borrow.create({
      user: userId,
      book: bookId,
      status: 'pending',
      dueDate: new Date(), 
    });

    console.log('New borrow request:', newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating borrow request:', error);
    res.status(500).json({ message: 'Failed to request borrow' });
  }
});
//to get all borrows
borrowRouter.get('/request', protect, isMember, async(req, res) => {

    const borrows = await Borrow.find();
    if(!borrows) return res.status(400).json({message:'No borrows'}) 
      
     return res.status(200).json(borrows);
})


// GET borrow requests filtered by status (only status allowed as query)
borrowRouter.get('/requests', protect, isLibrarian, async (req, res) => {
  try {

     const borrowRequests = await Borrow.find({status:req.query.status})
      .populate('book', 'title')
      .populate('user', 'name email');

    if (!borrowRequests || borrowRequests.length === 0) {
      return res.status(404).json({ message: 'No borrow requests found' });
    }

    res.status(200).json(borrowRequests);
  } catch (error) {
    console.error('Error fetching borrow requests by status:', error);
    res.status(500).json({ message: 'Failed to fetch borrow requests' });
  }
});

export default borrowRouter;
