import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  isbn: String,
   genre: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Genre' 
  },
   coverImage: String, // URL or local path
   totalCopies: {
    type: Number,
    required: true,
  },
  availableCopies: {
    type: Number,
    required: true,
  },
  isAvailable:{
    type:Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

// Pre-save hook to update isAvailable based on availableCopies
bookSchema.pre('save', function (next) {
  this.isAvailable = this.availableCopies > 0;
  next();
});


// Also update on findOneAndUpdate or updateOne
bookSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const availableCopies = update.availableCopies;

  if (typeof availableCopies === 'number') {
    update.isAvailable = availableCopies > 0;
    this.setUpdate(update);
  }

  next();
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
