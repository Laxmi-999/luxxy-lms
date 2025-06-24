import express from 'express';
import connection from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import bookRoute from './routes/bookRoutes.js';
import userRoute from './routes/userRoutes.js';
import dotenv from  'dotenv';
import reservationRoute from './routes/reservationRoutes.js';


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



//book route
app.use('/api/book', bookRoute);



//Reservation Routes
app.use('/api/reservation', reservationRoute)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
