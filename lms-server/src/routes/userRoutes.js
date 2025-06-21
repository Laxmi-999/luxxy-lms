import express from 'express';
import {
  getAdminProfile,
  getAllUsers,
  addLibrarian,
  updateUsere,
  deleteUser,
  addUser,
} from '../controllers/userController.js';
import { isAdmin, isLibrarian, protect } from '../Middleware/authMiddleware.js';


const userRoute = express.Router();

// All routes are protected and admin-only



// ---------user routes for admin only------\\
userRoute.get('/profile', getAdminProfile, protect, isAdmin);
userRoute.post('/add-librarian', addLibrarian, protect, isAdmin);


//----------userRoute for librarian and admin---------\\ 
userRoute.get('/get-all-users', getAllUsers, protect, isAdmin, isLibrarian);
userRoute.put('/update-user/:id', updateUsere, protect, isAdmin, isLibrarian);
userRoute.post('/add-user', addUser, protect, isAdmin, isLibrarian);
userRoute.delete('/delete-user/:id', deleteUser, protect, isAdmin, isLibrarian);

export default userRoute;
