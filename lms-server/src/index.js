import express from 'express';
import connection from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import bookRoute from './routes/bookRoutes.js';
import userRoute from './routes/userRoutes.js';
import dotenv from  'dotenv';
import reservationRoute from './routes/reservationRoutes.js';
import borrowRouter from './routes/borrowRoutes.js';
import activityRouter from './routes/activityRoutes.js';
import genreRouter from './routes/genreRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';

dotenv.config();
const port = process.env.PORT

const app = express()
app.use(cors());


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
connection();

//auth routes
app.use('/api/users', authRoutes)



//admin and librarian routes for managing users
app.use('/api/user', userRoute);



//book routes
app.use('/api/book', bookRoute);



//Reservation Routes
app.use('/api/reservation', reservationRoute)

// BorrowRequest route
app.use('/api/borrow', borrowRouter);

//activity routes
app.use('/api/activity', activityRouter);

//genreRoutes
app.use('/api/genre', genreRouter);

//reviewRoutes
app.use('/api/reviews', reviewRouter);
app.use('/uploads', express.static('uploads'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
