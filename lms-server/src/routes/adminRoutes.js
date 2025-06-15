import express from 'express';
import {
  getAdminProfile,
  getAllUsers,
  updateUserRole,
  addLibrarian,
  getAllBooks,
  getReport,
} from '../controllers/adminController.js';
import { isAdmin, protect } from '../Middleware/authMiddleware.js';

const adminRoute = express.Router();

// All routes are protected and admin-only
adminRoute.use(protect, isAdmin);

adminRoute.get('/profile', getAdminProfile);
adminRoute.get('/users', getAllUsers);
adminRoute.put('/users/role', updateUserRole);
adminRoute.post('/add-librarian', addLibrarian);
adminRoute.get('/books', getAllBooks);
adminRoute.get('/reports', getReport);

export default adminRoute;
