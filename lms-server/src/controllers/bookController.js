import Book from "../models/book.js";



//add new book
export const createBook = async(req, res) => {

    try{
        const {title, author, isbn, category, coverImage, totalCopies} = req.body;

        const newBook = await Book.create({
            title,
            author,
            isbn,
            category,
            coverImage,
            totalCopies,
            availableCopies : totalCopies

        });
        res.status(201).json(newBook);
    }catch(error){
        return res.status(500).json({message: 'error while adding book'});
    }
}

// to get all books
export const getAllBooks = async(req, res) => {
    try {

        const books  = await Book.find();
        res.status.json(books);
        
        
    } catch (error) {

        return res.status(500).json({message: 'error while getting all books'})
        
    }
}


// get single book by id
export const getBookById = async(req, res) =>{

    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);
        res.status.json(booj);
        
    } catch (error) {

        return res.status(500).json({message:'error while  getting the book by id ', error})
        
    }
}

//to update a book by id

export const updateBook = async(req, res) => {
    try {
        
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {...req.body}, {new:true});
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.status.json(updatedBook);
    } catch (error) {

        return res.status(500).json({message: 'error while updating book', error})
        
    }

}

//delete book by id

export const deleteBook = async(req, res) =>{
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if(!deletedBook) return res.status.json({message:'book not found'})
        res.status.json(deletedBook);
        
    } catch (error) {

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
        });
        res.json(books);

    }catch(error){
        res.status(500).json({message:'search failed', error});
    }
}