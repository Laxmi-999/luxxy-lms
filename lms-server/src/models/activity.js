// models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
    type: {
      type: String,
      enum: ['issued', 'returned', 'reserved', 'overdue-voice-note'],
      required: true,
    },
    book: {
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
    },
    user: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String,
    },
    librarian: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
