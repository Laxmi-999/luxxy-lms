// models/borrow.js
import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
     required: true 
      },
  book: {
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
       required: true
     },
  borrowDate: {
     type: Date, 
     default: Date.now
     },
  dueDate: {
     type: Date,
      required: true 
    },
  returnDate: { 
    type: Date 
},
  status: { 
    
    type: String, enum: ['pending', 'issued', 'returned', 'rejected'],
     default: 'pending' }
});

const Borrow =  mongoose.model('Borrow', borrowSchema);
export default Borrow;
