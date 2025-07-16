
import express from 'express';
import Book from '../models/book.js';
import { isLibrarian, protect } from '../Middleware/authMiddleware.js';
import Borrow from '../models/borrow.js';
import { isMember } from '../Middleware/authMiddleware.js';
import Activity from '../models/activity.js';
import { calculateFine } from '../utils/fineCalculation.js'



const borrowRouter = express.Router();



borrowRouter.post('/request', protect, isMember,  async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; 

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }


    //checking if the user have already borrow the same book and have not returned yet   
    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['pending', 'approved'] } // Checking for active borrow statuses
    });

     if (existingBorrow) {
      let message = '';
      if (existingBorrow.status === 'pending') {
        message = 'You already have a pending borrow request for this book.';
      } else if (existingBorrow.status === 'approved') {
        message = 'You have already borrowed this book and have not returned it yet.';
      } 
      return res.status(400).json({ message });
    }

    
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available for borrowing' });
    }

    const newRequest = await Borrow.create({
      user: userId,
      book: bookId,
      status: 'pending',
    });

    console.log('New borrow request:', newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating borrow request:', error);
    res.status(500).json({ message: 'Failed to request borrow' });
  }
});

//to get all borrows

borrowRouter.get('/request', protect, isMember, async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user._id }) 
      .populate('book', 'title author') 
      .lean(); // so we can modify plain objects

    if (!borrows || borrows.length === 0) {
      return res.status(400).json({ message: 'No borrows' });
    }

    //fine calcuating before sending response
    const borrowsWithFine = borrows.map((borrow) => {
      if (!borrow.returnDate) {
        borrow.fine = calculateFine(borrow.dueDate); // live fine
      }
      return borrow;
    });

    return res.status(200).json(borrowsWithFine);
  } catch (err) {
    console.error('Error fetching borrows:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
});


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
    const { dueDate } = req.body;

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
    borrow.dueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from the borrow date
    borrow.issuedBy = req.user._id;
    console.log('issued book is', borrow);
    

    await borrow.save();

    // Update book copies
      book.availableCopies -= 1;
      await book.save();


      //creating activity
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


// return request by member 
// Return a borrowed book
borrowRouter.put('/return/:borrowId', protect, isMember, async (req, res) => {
  try {
    const { borrowId } = req.params;
  console.log('borrow id is', borrowId);
  
    const borrow = await Borrow.findById(borrowId).populate('book').populate('user');
    console.log('borrow is ', borrow);
    
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
    console.log('book return request sent successfully');
    
    res.status(200).json({ message: 'Book return request sent successfully', borrow });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Failed to return book' });
  }
});






borrowRouter.put('/confirm-return/:borrowId', protect, isLibrarian, async (req, res) => {
  try {
    const { borrowId } = req.params;
    console.log('borrow id is', borrowId);
    

    const borrow = await Borrow.findById(borrowId).populate('book').populate('user');
       console.log('returning borrow is', borrow);
       
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // Ensure the borrow status is 'pending-return' before confirming
    if (borrow.status !== 'returned') {
      
      return res.status(400).json({ message: 'This book is not in a pending return state.' });
    }



    // Updating borrow status
    borrow.status = 'idle'; 

    await borrow.save();

    // updating book availablity
    const book = borrow.book;
    book.availableCopies += 1;
    await book.save();

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
        _id: req.user._id, // The librarian confirming the return
        email: req.user.email,
      },
    });

    console.log('Book return confirmed successfully');
    res.status(200).json({ message: 'Book return confirmed successfully', borrow });

  } catch (error) {
    console.error('Error confirming return:', error);
    res.status(500).json({ message: 'Failed to confirm book return' });
  }
});

borrowRouter.get('/my-borrows', protect, isMember, async (req, res) => {
  try {
    const userId = req.user._id; 

    const myBorrows = await Borrow.find({ user: userId })
                                  .populate('book')
                                  .populate('user')
                                  .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    if (!myBorrows || myBorrows.length === 0) {
      return res.status(404).json({ message: 'No borrow records found for this user.' });
    }

    res.status(200).json({ borrows: myBorrows });

  } catch (error) {
    console.error('Error fetching user borrow history:', error);
    res.status(500).json({ message: 'Failed to fetch borrow history.' });
  }
});

export default borrowRouter;
