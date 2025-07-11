
import express from 'express';
import Book from '../models/book.js';
import { isLibrarian, protect } from '../Middleware/authMiddleware.js';
import Borrow from '../models/borrow.js';
import { isMember } from '../Middleware/authMiddleware.js';
import Activity from '../models/activity.js';



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

// Approve a borrow request (Issue the book)
borrowRouter.put('/approve/:borrowId', protect, isLibrarian, async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId).populate('book').populate('user');
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow request not found' });
    }

    if (borrow.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been processed' });
    }

    const book = borrow.book;
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No available copies to issue' });
    }

    // Update borrow status and dates
    borrow.status = 'approved';
    borrow.borrowDate = new Date();
    borrow.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // e.g., 7 days later
    borrow.issuedBy = req.user._id;
    console.log('issued book is', borrow);
    

    await borrow.save();

    // Update book copies
      book.availableCopies -= 1;
      await book.save();


       const user = borrow.user;
       await Activity.create({
        type: 'issued', // or 'returned'
        book: {
          _id: book._id,
          title: book.title,
        },
        user: {
          _id: user._id,
          email: user.email,
        },
        librarian: {
          _id: req.user._id,
          email: req.user.email,
        },
      });


    return res.status(200).json({ message: 'Book issued successfully', borrow });
  } catch (error) {
    console.error('Error approving borrow:', error);
    return res.status(500).json({ message: 'Failed to issue book' });
  }
});


// Return a borrowed book
borrowRouter.put('/return/:borrowId', protect, async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId).populate('book').populate('user');
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrow.status !== 'approved') {
      return res.status(400).json({ message: 'Book has not been issued or already returned' });
    }

    // Update borrow status
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // Update book availability
    const book = borrow.book;
    book.availableCopies += 1;
    await book.save();

    // Create activity log
    await Activity.create({
      type: 'returned',
      book: {
        _id: book._id,
        title: book.title,
      },
      user: {
        _id: borrow.user._id,
        email: borrow.user.email,
      },
      librarian: {
        _id: req.user._id,
        email: req.user.email,
      },
    });
    console.log('book returned successfully');
    
    res.status(200).json({ message: 'Book returned successfully', borrow });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Failed to return book' });
  }
});


export default borrowRouter;
