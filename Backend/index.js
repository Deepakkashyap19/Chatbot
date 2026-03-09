import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatbotRoute from './routes/chatbot.route.js';
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

const port = process.env.PORT || 3000;

// Check if MONGO_URI is loaded
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);


// Database connection code 
mongoose.connect(process.env.MONGO_URI)
.then(()=>{  
  console.log('Connected to database');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}).catch( (error) => {
    console.log('Error connecting to database:', error.message);
    console.log('Starting server without database connection for testing...');
    app.listen(port, () => {
      console.log(`Example app listening on port ${port} (no database)`);
    });
});

// Defining Routes
app.use('/bot/v1/message', chatbotRoute);
