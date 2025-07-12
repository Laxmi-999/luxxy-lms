import express from 'express';
import Genre from '../models/genre.js';
import { protect, isLibrarian, isAdmin } from '../Middleware/authMiddleware.js';

const genreRouter = express.Router();

// Create a new genre
genreRouter.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { name, image } = req.body;
    // console.log(req.body);
    
    if (!name) return res.status(400).json({ message: 'Genre name is required' });

    const existing = await Genre.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Genre already exists' });

    const genre = new Genre({ name, image });
    await genre.save();
    console.log(genre);
    
     return res.status(201).json({genre});
  } catch (err) {
    res.status(500).json({ message: 'Failed to create genre' });
  }
});

// Get all genres
genreRouter.get('/', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
});

genreRouter.patch('/:id', async(req, res) => {

    try{
        const genreId = req.params;
        const updates = req.body;

        const UpdatedGenre = await Genre.findByIdAndUpdate(
            genreId,
            updates,
            {new:true} // return the updated document
        ) 

        if(!UpdatedGenre){
            res.status(404).json({message: 'genre not found'})
        }
        res.status(200).json(UpdatedGenre);
    }catch(error){
        console.log('error while updating genre', error);
        
        res.status(500).json({message:'failed to update genre'});
    }

})



export default genreRouter;
