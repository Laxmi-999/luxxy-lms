import express from 'express';
import { isAdmin, isLibrarian, protect } from '../Middleware/authMiddleware.js';
import { createBook, deleteBook, getAllBooks, getBookById, getReport, searchBook, updateBook } from '../controllers/bookController.js';


const bookRoute = express.Router();

// routes that are protected, admin and librarian Only
bookRoute.post('/add-book', createBook, protect, isAdmin, isLibrarian);
bookRoute.put('/update-book/:id', updateBook, protect, isAdmin, isLibrarian);
bookRoute.delete('/delete-book/:id', deleteBook, protect, isAdmin, isLibrarian);
// bookRoute.get('/get-report', getReport, protect, isAdmin);



//Routes that are accessible to all users i.e admin, librarian and member users
bookRoute.get('/search-book', searchBook);
bookRoute.get('/get-all-books', getAllBooks);
bookRoute.get('/get-single-book/:id', getBookById);



export default bookRoute;