import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to:', uri.split('@')[1]); // Log host only for safety

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Cloud!');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
