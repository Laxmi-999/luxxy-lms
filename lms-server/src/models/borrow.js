
import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { 
    type: Date 
  },
  returnDate: { type: Date }, 
  status: {
    type: String,
    enum: ['pending', 'approved', 'returned', 'idle'],
    default: 'idle'
  },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // librarian issuing
  fine: { type: Number, default: 0 },
  dueDate: { type: Date },
}, { timestamps: true });

const Borrow = mongoose.models.Borrow || mongoose.model('Borrow', borrowSchema);
export default Borrow;
