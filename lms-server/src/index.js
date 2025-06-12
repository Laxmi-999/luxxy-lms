import express from 'express';
import connection from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors';


const app = express()
const port = 8080
app.use(cors())


app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
connection();

//auth routes
app.use('/api/users', authRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
