import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatbotRoute from './routes/chatbot.route.js';
import cors from "cors";

// ✅ Fixed: Removed hardcoded local path
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log(`Server running on port ${port}`); // ✅ Fixed: port (lowercase)

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to database:', error.message);
    console.log('Starting server without database connection for testing...');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port} (no database)`);
    });
  });

// Defining Routes
app.use('/bot/v1/message', chatbotRoute);