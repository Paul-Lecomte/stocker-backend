const express = require('express');
const { errorHandler } = require("./middleware/errorHandler");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Import routes
const stockMovementRoutes = require('./routes/stockMovementsRoutes');
const aisleRoutes = require('./routes/aisleRoutes'); // Import the aisle routes

// Connect to the database
connectDB();

// Server configuration
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Declare routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/furniture', require('./routes/furnitureRoutes'));
app.use('/api/stock-movements', stockMovementRoutes);  // Route for stock movements
app.use('/api/aisles', aisleRoutes); // Route for aisles

// Error handling
app.use(errorHandler);

// Start the server after connecting to MongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
    console.log(`MongoDB connection error: ${err}`);
});