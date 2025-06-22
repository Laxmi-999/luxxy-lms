// models/Reservation.js
import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  reservedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  rejectedAt: Date,
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
