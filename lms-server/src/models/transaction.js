// src/models/transaction.js
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // Our internal unique identifier for the transaction
  // This is the 'txNfId' or 'product_code' we send to eSewa
  transactionUuid: {
    type: String,
    required: true,
    unique: true,
    index: true, // Add index for faster lookups
  },
  // The reference ID provided by eSewa after a successful transaction
  // This is 'refId' from eSewa's verification response
  esewaRefId: {
    type: String,
    required: false, // Not available until payment is complete/verified
    sparse: true, // Allows multiple documents to have null/undefined for this field
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
  },
  // Array of borrow IDs that this transaction is paying fines for
  borrowIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow', // Reference to your Borrow model
    required: true,
  }],
  status: {
    type: String,
    enum: ['INITIATED', 'PENDING', 'COMPLETE', 'FAILED'],
    default: 'INITIATED',
    required: true,
  },
  verifiedAt: {
    type: Date,
    required: false, // Set when verification is performed
  },
  // Store the raw callback data from eSewa for auditing/debugging
  esewaCallbackData: {
    type: mongoose.Schema.Types.Mixed, // Can store any type of data (string, object, etc.)
    required: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
