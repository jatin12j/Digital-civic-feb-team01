const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// Request logger
app.use(morgan('dev'));

// Custom logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// CORS Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/
    ];

    const isAllowed = allowedOrigins.some(regex => regex.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
// Handle preflight requests for all routes using Express 5 format
app.options(/(.*)/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health Check - server updated to port 5001 (AirPlay conflict on 5000)
app.get('/', (req, res) => {
  res.send('Civix Backend is running');
});

// Database Connection
// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civix';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
