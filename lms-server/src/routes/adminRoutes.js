import express from 'express';
import {
  getAdminProfile,
  getAllUsers,
  addLibrarian,
  getAllBooks,
  getReport,
  updateUsere,
  deleteUser,
  addUser,
} from '../controllers/adminController.js';
import { isAdmin, protect } from '../Middleware/authMiddleware.js';
import { createBook, deleteBook, getBookById, searchBook, updateBook } from '../controllers/bookController.js';

const adminRoute = express.Router();

// All routes are protected and admin-only
adminRoute.use(protect, isAdmin);

// ---------user routes for admin------\\

adminRoute.get('/profile', getAdminProfile);
adminRoute.get('/users', getAllUsers);
adminRoute.put('/update-user/:id', updateUsere);
adminRoute.post('/add-user', addUser);
adminRoute.post('/add-librarian', addLibrarian);
adminRoute.delete('/delete-user/:id', deleteUser);


// ---------book routes for admin------\\
adminRoute.post('/add-book', createBook);
adminRoute.get('/get-books', getAllBooks);
adminRoute.get('/get-book/:id', getBookById);
adminRoute.put('/update-book/:id', updateBook);
adminRoute.delete('/delete-book/:id', deleteBook);
adminRoute.get('/search-book', searchBook);



adminRoute.get('/reports', getReport);

export default adminRoute;
