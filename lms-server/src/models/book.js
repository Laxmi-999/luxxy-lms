import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  isbn: String,
  category: String,
  coverImage: String, // URL or local path
  totalCopies: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Book", bookSchema);
