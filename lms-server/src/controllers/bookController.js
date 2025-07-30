import Book from "../models/book.js";


//add new book
export const createBook = async(req, res) => {

    try{
        const {title, author, isbn, genre, coverImage, isAvailable, totalCopies} = req.body;

        const newBook = await Book.create({
            title,
            author,
            isbn,
            genre,
            coverImage,
            totalCopies,
            isAvailable,
            availableCopies : totalCopies

        });

        console.log('added book is', newBook);
        
        res.status(201).json(newBook);
    }catch(error){
        console.log('error while adding book', error);
        
        return res.status(500).json({message: 'error while adding book'});
    }
}

// to get all books
export const getAllBooks = async(req, res) => {
    try {

       const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      //calculating for skip
      const skip = (page -1) * limit;
     
        const books  = await Book.find()
        .populate('genre', 'name')
        .skip(skip)
        .limit(limit);


        // sending total num of books and  total pages to the frontend 
         const totalBooks = await Book.countDocuments();
         const totalPages = Math.ceil(totalBooks/limit);
        //  const totalPages = 100;

        return  res.status(200).json({
            books,
            totalBooks,
            totalPages
        });
        
    } catch (error) {

        
        return res.status(500).json({message: 'error while getting all books'})
        
    }
}


// get single book by id
export const getBookById = async(req, res) =>{

    try {
        // const bookId = req.params.id;

        const book = await Book.findById(req.params.id).populate('genre', 'name');     
         return res.status(200).json(book);
        
    } catch (error) {

        return res.status(500).json({message:'error while  getting the book by id ', error})
        
    }
}

//to update a book by id

export const updateBook = async(req, res) => {
    try {
        
 const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('genre', 'name');
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
   console.log('updated book is', updateBook);
       
     return res.status(200).json(updatedBook);
    } catch (error) {
         console.log('error while updating book', error);
         
        return res.status(500).json({message: 'error while updating book', error})
        
    }

}

//delete book by id

export const deleteBook = async(req, res) =>{
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if(!deletedBook) return res.status(400).json({message:'book not found'})
       console.log('deleted book is', deletedBook);
       
        res.status(200).json(deletedBook);
        
    } catch (error) {
         console.log('error while deleting book', error);
         
        res.status(500).json({message:'error while deleting book', error})
        
    }
}

//search book by title and author

export const searchBook = async(req, res) => {

    const {query} = req.query;
    try{
        const books = await Book.find({
            $or:[
                {title : {$regex:query, $options:'i'}},
                {author : {$regex:query, $options:'i'}}
            ],
        }).populate('genre', 'name');;
        res.json(books);

    }catch(error){
        res.status(500).json({message:'search failed', error});
    }
}


// Reports (basic example)
export const getReport = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    res.json({ totalUsers: userCount, totalBooks: bookCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};