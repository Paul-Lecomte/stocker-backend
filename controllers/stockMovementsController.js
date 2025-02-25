const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Furniture = require('../models/furnitureModel');
const StockMovement = require('../models/StockMovement');

// @desc     Get all furniture items with their movements
// @route    GET /api/stock-movements/all
// @access   Private
const getAllFurnitureWithMovements = asyncHandler(async (req, res) => {
    // Fetch all furniture items
    const furnitureItems = await Furniture.find();

    if (!furnitureItems.length) {
        res.status(404);
        throw new Error("No furniture found.");
    }

    // Map over each furniture item to fetch their movements
    const furnitureWithMovements = await Promise.all(
        furnitureItems.map(async (furniture) => {
            const movements = await StockMovement.find({ furnitureId: furniture._id }).sort({ createdAt: 1 });
            return { ...furniture.toObject(), movements };
        })
    );

    res.status(200).json(furnitureWithMovements);
});

// @desc     Get movements for a specific furniture item within a date range
// @route    GET /api/stock-movements/:furnitureId/movements
// @access   Private
const getMovementsByFurnitureId = asyncHandler(async (req, res) => {
    const { furnitureId } = req.params;
    const { startDate, endDate } = req.query;


    // Validate if furnitureId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
        res.status(400);
        throw new Error('Invalid furniture ID format');
    }

    const filter = { furnitureId: new mongoose.Types.ObjectId(furnitureId) };

    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Fetch movements based on the filter
    const movements = await StockMovement.find(filter).sort({ createdAt: 1 });


    if (!movements.length) {
        res.status(404);
        throw new Error('No stock movements found for this furniture item');
    }

    res.status(200).json(movements);
});

const getStockMovementsHistory = asyncHandler(async (req, res) => {
    const { startDate, endDate, userId } = req.query;

    const filter = {};

    // Apply user filter if provided
    if (userId) {
        filter.modifiedBy = { $regex: userId, $options: 'i' }; // Case-insensitive match
    }

    // Apply date range filter if provided
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Fetch stock movements with the filter
    const movements = await StockMovement.find(filter).sort({ createdAt: -1 });

    if (!movements.length) {
        res.status(404);
        throw new Error('No stock movements found with the given filters');
    }

    res.status(200).json(movements);
});

module.exports = {
    getAllFurnitureWithMovements,
    getMovementsByFurnitureId,
    getStockMovementsHistory
};