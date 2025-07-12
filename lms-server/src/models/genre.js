import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
    image: {
    type: String, 
    required: false 
  }
});

const Genre = mongoose.model('Genre', genreSchema);

export default Genre;
