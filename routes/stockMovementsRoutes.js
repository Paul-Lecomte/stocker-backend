const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllFurnitureWithMovements, getMovementsByFurnitureId } = require('../controllers/stockMovementsController');

// @route    GET /api/stock-movements/all
// @desc     Get all furniture items with their movements
// @access   Private
router.get('/all', protect, getAllFurnitureWithMovements);

// @route    GET /api/stock-movements/:furnitureId/movements
// @desc     Get movements for a specific furniture item within a date range
// @access   Private
router.get('/:furnitureId/movements', protect, getMovementsByFurnitureId);

module.exports = router;
