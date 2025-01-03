const express = require('express');
const { errorHandler } = require("./middleware/errorHandler");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const path = require('path');
const upload = require('./middleware/uploadMiddleware');
const PORT = process.env.PORT || 5000;

// Import routes
const stockMovementRoutes = require('./routes/stockMovementsRoutes');
const aisleRoutes = require('./routes/aisleRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Connect to the database
connectDB();

// Server configuration
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Serve static files (images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Declare routes
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/furniture', require('./routes/furnitureRoutes'));
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/aisles', aisleRoutes);
app.use('/api/notifications', notificationRoutes);

// Image upload route
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Respond with the image file path to use on the frontend
    res.json({ picture: `uploads/${req.file.filename}` });
});

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