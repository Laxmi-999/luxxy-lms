// db/connection.js
import mongoose from 'mongoose';

async function connection() {
  try {
    // Attempt to connect to MongoDB using the provided URI
    const res = await mongoose.connect('mongodb://localhost:27017/luxxy-lms');
    // If connection is successful, log a success message
    if (res) {
      console.log('Database connected successfully');
    }
  } catch (error) {
    // If an error occurs during connection, log the error
    console.error('Database connection failed:', error.message);
    // You might want to exit the process if the database connection is critical
    // process.exit(1); 
  }
}

export default connection;
