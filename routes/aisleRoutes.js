const express = require('express');
const { createAisle, deleteAisle, getAllAisles } = require('../controllers/aisleController');

const router = express.Router();

// Route to create a new aisle
router.post('/', createAisle);

// Route to delete an aisle by ID
router.delete('/:id', deleteAisle);

// Route to fetch all aisles
router.get('/all', getAllAisles);

module.exports = router;