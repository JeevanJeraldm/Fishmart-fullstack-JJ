const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orders')
const path = require('path')
// Load environment variables
dotenv.config();
console.log('Environment loaded, PORT:', process.env.PORT);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve images from the uploads folder
app.use('/uploads', express.static('uploads'));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
console.log('Attempting MongoDB connection to:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Fish Mart API is running' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', orderRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try these URLs:
  - http://localhost:${PORT}
  - http://localhost:${PORT}/health
  - http://localhost:${PORT}/api/products`);
});