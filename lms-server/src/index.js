import express from 'express';
import connection from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';
import adminRoute from './routes/adminRoutes.js';


const app = express()
const port = 8000
app.use(cors())


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
connection();

//auth routes
app.use('/api/users', authRoutes)

//adminRoutes
app.use('/api/admin', adminRoute)
//eg. (localhost:8000/api/admin/profile)
//eg. (localhost:8000/api/admin/users)
//eg. (localhost:8000/api/admin/users/role)
//eg. (localhost:8000/api/admin/librarians)
//eg. (localhost:8000/api/admin/books)
//eg. (localhost:8000/api/admin/reports)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
