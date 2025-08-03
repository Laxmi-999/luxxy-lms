import express from 'express';
import connection from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import bookRoute from './routes/bookRoutes.js';
import userRoute from './routes/userRoutes.js';
import dotenv from 'dotenv';
import reservationRoute from './routes/reservationRoutes.js';
import borrowRouter from './routes/borrowRoutes.js';
import activityRouter from './routes/activityRoutes.js';
import genreRouter from './routes/genreRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import path from 'path'; // Import path
import { fileURLToPath } from 'url'; // Import fileURLToPath
import './jobs/overdueCheck.js';
import notificationRouter from './routes/notificationRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import esewaRouter from './routes/esewaRoutes.js';

dotenv.config();
const port = process.env.PORT || 8000; // Provide a default port for safety

const app = express()

// Middleware should generally come first
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    credentials: true
}));

app.use(express.json()); // Body parser for JSON requests

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connection(); // Call your database connection function

// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to your public folder
const publicPath = path.join(__dirname, '../public');

// *** THE CRITICAL FIX IS HERE: Add this line to serve static files ***
// This middleware should be placed before your API routes
// so that Express checks for static files first.
app.use(express.static(publicPath));


// Also, ensure your 'uploads' static serving is correctly placed and path is valid
// Assuming 'uploads' is also in the server root, parallel to 'public' and 'src'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// --- API Routes ---
// Auth routes
app.use('/api/users', authRoutes);

// Admin and librarian routes for managing users
app.use('/api/user', userRoute);

// Book routes
app.use('/api/book', bookRoute);

// Reservation Routes
app.use('/api/reservation', reservationRoute);

// BorrowRequest route
app.use('/api/borrow', borrowRouter);

// Activity routes
app.use('/api/activity', activityRouter);

// Genre routes
app.use('/api/genre', genreRouter);

// Review routes
app.use('/api/reviews', reviewRouter);

// Notification routes
app.use('/api/notifications', notificationRouter);

//report routes
app.use('/api/reports', reportRouter);

//payment routes
app.use('/api', esewaRouter);



// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
