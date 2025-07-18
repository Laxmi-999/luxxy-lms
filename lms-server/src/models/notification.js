import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    // NEW: Reference to the specific Borrow document this notification is about
  borrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow',
    required: false // Not all notifications might be about a borrow
  },
  type: {
    type: String,
    // Add 'overdue-voice-note' to the enum
    enum: ['overdue-voice-note', 'system-message', 'borrow-status-update'],
    required: true
  },
  message: { // Text message for context, even if audio is present
    type: String,
    required: true
  },
  audioUrl: { // Relative URL to the generated voice note file (e.g., /voice_notes/overdue_user123.mp3)
    type: String,
    required: false // Not all notifications might have audio
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Notification = mongoose.models.Notification ||  mongoose.model('Notification', notificationSchema);
export default Notification;
