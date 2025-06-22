// File: routes/reservationRoutes.js
import express from 'express';
import { isLibrarian, protect } from '../Middleware/authMiddleware.js';
import { approveReservation, createReservation, getAllPendingReservations, getUserReservations, rejectReservation } from '../controllers/reservationController.js';


const reservationRoute = express.Router();

//  Routes for Members
reservationRoute.post('/reserve', protect, createReservation);  
reservationRoute.get('/my-reservations', protect, getUserReservations); 




//  Routes for Librarians
reservationRoute.get('/pending', protect, isLibrarian, getAllPendingReservations);  
reservationRoute.put('/approve/:id', protect, isLibrarian, approveReservation);  
reservationRoute.put('/reject/:id', protect, isLibrarian, rejectReservation);    



export default reservationRoute;
