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

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const port = process.env.PORT || 8000; // Provide a default port for safety

const app = express();
const httpServer = createServer(app);

// combine express and socket  server
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {

  //listen from the client or recived from the client
  socket.on('notification', (notificationId) => {
    console.log(`received notification from the client, ${notificationId}`);


    //emit to the client or send to the client
    io.emit('notificationId', (notificationId))
    
  })
});




app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
    credentials: true
}));

app.use(express.json()); // Body parser for JSON requests

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connection(); 


// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define the path to your public folder
const publicPath = path.join(__dirname, '../public');


// This middleware should be placed before your API routes
// so that Express checks for static files first.
app.use(express.static(publicPath));


// 'uploads' is also in the server root, parallel to 'public' and 'src'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



// --- API Routes ---
app.use('/api/users', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/book', bookRoute);
app.use('/api/reservation', reservationRoute);
app.use('/api/borrow', borrowRouter);
app.use('/api/activity', activityRouter);
app.use('/api/genre', genreRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/reports', reportRouter);




// Start the server
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
