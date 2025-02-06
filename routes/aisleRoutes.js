const express = require('express');
const { createAisle, deleteAisle, getAllAisles } = require('../controllers/aisleController');
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a new aisle
router.post('/',protect, createAisle);

// Route to delete an aisle by ID
router.delete('/:id',protect, deleteAisle);

// Route to fetch all aisles
router.get('/all',protect, getAllAisles);

module.exports = router;