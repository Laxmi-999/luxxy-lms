import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connection() {
  try {

    const res = await mongoose.connect(process.env.MONGO_URL);

    if (res) {
      console.log('Database connected successfully');
    }
  } catch (error) {

    console.error('Database connection failed:', error.message);
   
  }
}

export default connection;
