// app.js - Main Express application entry point

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const bugsRoutes = require('./routes/bugs');

const app = express();

// CORS configuration for production deployment
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Vercel URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow requests from Vercel preview deployments
      if (origin && origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Temporarily allow all for easier setup
        // For production, uncomment the line below to restrict:
        // callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Bug Tracker API',
    version: '1.0.0',
    status: 'OK',
    endpoints: {
      health: '/health',
      api: '/api/bugs',
      documentation: 'See README.md for API documentation'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Bug Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/bugs', bugsRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler (must be last)
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    // Load environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-tracker';
    
    if (!process.env.MONGODB_URI) {
      console.warn('Warning: MONGODB_URI not found in environment variables. Using default local MongoDB.');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Debug logging for connection
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connection established successfully');
      console.log(`Connection string: ${mongoURI.replace(/:[^:@]+@/, ':****@')}`); // Hide password
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Log full error stack for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
      console.error('Stack:', error.stack);
    }
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if MONGODB_URI is set correctly in .env file');
    console.error('2. Verify MongoDB Atlas network access (IP whitelist)');
    console.error('3. Verify database user credentials');
    console.error('4. Check internet connectivity');
    process.exit(1);
  }
};

// Only connect to DB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;

