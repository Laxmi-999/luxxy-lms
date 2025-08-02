// -----------------------------------------------------------------------------
// models/PaymentAttempt.js
// Defines the Mongoose schema for tracking eSewa payment attempts.
// -----------------------------------------------------------------------------

import mongoose from 'mongoose';

const paymentAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  borrowIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Borrow' }], // Link to affected borrows
  transactionUuid: { type: String, required: true, unique: true }, // Our unique ID for eSewa (pid)
  eSewaRefId: { type: String }, // eSewa's reference ID after success (refId)
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  initiatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  failedAt: { type: Date },
  esewaResponse: { type: Object }, // Store raw eSewa response for debugging/auditing
}, { timestamps: true });

export default mongoose.model('PaymentAttempt', paymentAttemptSchema);
