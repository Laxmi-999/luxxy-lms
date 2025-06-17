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

const adminRoute = express.Router();

// All routes are protected and admin-only
adminRoute.use(protect, isAdmin);

adminRoute.get('/profile', getAdminProfile);
adminRoute.get('/users', getAllUsers);
adminRoute.put('/update-user/:id', updateUsere);
adminRoute.post('/add-user', addUser);
adminRoute.post('/add-librarian', addLibrarian);
adminRoute.delete('/delete-user/:id', deleteUser);
adminRoute.get('/books', getAllBooks);
adminRoute.get('/reports', getReport);

export default adminRoute;
