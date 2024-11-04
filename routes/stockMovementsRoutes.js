const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const StockMovement = require('../models/StockMovement');
const { protect } = require('../middleware/authMiddleware');

// @desc     Get movements for a specific furniture item within a date range
// @route    GET /api/stock-movements/:furnitureId/movements
// @access   Private
router.get('/:furnitureId/movements', protect, async (req, res, next) => {
    const { furnitureId } = req.params;
    const { startDate, endDate } = req.query;

    console.log(`Fetching movements for: ${furnitureId} with startDate: ${startDate}, endDate: ${endDate}`);

    try {
        // Validate if furnitureId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
            return res.status(400).json({ message: 'Invalid furniture ID format' });
        }

        const filter = { furnitureId: new mongoose.Types.ObjectId(furnitureId) };

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const movements = await StockMovement.find(filter).sort({ createdAt: 1 });
        console.log("Fetched movements:", movements);

        if (!movements.length) {
            return res.status(404).json({ message: 'No stock movements found for this furniture item' });
        }

        res.json(movements);
    } catch (error) {
        console.error("Error fetching movements:", error);
        next(error);
    }
});

module.exports = router;
