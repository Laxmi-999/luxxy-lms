// src/routes/transactions.js (or src/routes/esewaRoutes.js)
import express from 'express';
import { EsewaInitiatePayment, paymentStatus } from '../controllers/esewaController.js';

const esewaRouter = express.Router();

// Route to initiate eSewa payment
esewaRouter.post('/esewa/initiate-payment', EsewaInitiatePayment);

// Route to check eSewa payment status (called by frontend after redirect)
esewaRouter.post('/esewa/payment-status', paymentStatus);

export default esewaRouter;
