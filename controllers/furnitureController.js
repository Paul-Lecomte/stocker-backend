const asyncHandler = require('express-async-handler');
const Furniture = require('../models/furnitureModel');
const StockMovement = require('../models/stockMovement');
const upload = require('../middleware/uploadMiddleware');
const fs = require('fs');

// @desc     Create furniture with picture upload
// @route    POST /api/furniture/create
// @access   private
const create = asyncHandler(async (req, res) => {
    const { name, quantity, price, description, location, movement } = req.body;
    const picture = req.file ? req.file.path : null;

    if (!name || !quantity || !price || !description || !location) {
        res.status(400);
        throw new Error('Missing required field');
    }

    // Check if the object already exists in the DB
    const furnitureExists = await Furniture.findOne({ name });
    if (furnitureExists) {
        res.status(400);
        throw new Error('This furniture already exists');
    }

    const furniture = await Furniture.create({
        name,
        quantity,
        price,
        description,
        location,
        movement,
        picture
    });

    res.status(201).json(furniture);
});

// @desc     Get furniture info
// @route    GET /api/furniture/:_id
// @access   private
const getFurniture = asyncHandler(async (req, res) => {
    const furniture = await Furniture.findById(req.params._id);

    if (furniture) {
        res.status(200).json({
            _id: furniture._id,
            name: furniture.name,
            quantity: furniture.quantity,
            price: furniture.price,
            description: furniture.description,
            location: furniture.location,
            movement: furniture.movement,
            picture: furniture.picture
        });
    } else {
        res.status(400);
        throw new Error('Error furniture does not exist');
    }
});

// @desc     Update furniture info and picture
// @route    PUT /api/furniture/:_id
// @access   private
const updateFurniture = asyncHandler(async (req, res) => {
    const furniture = await Furniture.findById(req.params._id);
    if (!furniture) {
        res.status(400);
        throw new Error("The furniture item doesn't exist");
    }

    const previousQuantity = furniture.quantity;
    const newQuantity = req.body.quantity ?? previousQuantity;

    // Only record stock movement if the quantity changes
    if (newQuantity !== previousQuantity) {
        const quantityChange = newQuantity - previousQuantity;
        const movementType = quantityChange > 0 ? "IN" : "OUT";

        const stockMovement = new StockMovement({
            furnitureId: furniture._id,
            quantityChange,
            quantity: newQuantity,
            movementType,
            modifiedBy: req.body.modifiedBy, // Ensure the correct field is used
            name: furniture.name // Include the name in the stock movement
        });
        await stockMovement.save();
        furniture.quantity = newQuantity; // Update furniture quantity
    }

    // Always update other fields, even if the quantity doesn't change
    furniture.name = req.body.name || furniture.name;
    furniture.price = req.body.price || furniture.price;
    furniture.description = req.body.description || furniture.description;
    furniture.location = req.body.location || furniture.location;
    furniture.movement = req.body.movement || furniture.movement;

    // Handle picture update if present
    if (req.file) {
        furniture.picture = req.file.path; // Update picture
    }

    try {
        await furniture.save();
    } catch (error) {
        res.status(500).json({ message: "Error saving furniture", error: error.message });
        return;
    }

    res.status(200).json(furniture);
});

// @desc     Delete furniture item and its picture
// @route    DELETE /api/furniture/delete/:_id
// @access   private
const deleteFurniture = asyncHandler(async (req, res) => {
    const furniture = await Furniture.findById(req.params._id);
    if (!furniture) {
        res.status(404);
        throw new Error("Furniture item not found");
    }

    // Delete picture file if it exists
    if (furniture.picture) {
        fs.unlink(furniture.picture, (err) => {
            if (err) console.error("Error deleting image:", err);
        });
    }

    await Furniture.findByIdAndDelete(req.params._id);

    res.status(200).json({ message: "Furniture item and picture deleted successfully" });
});

// @desc     Increment furniture quantity
// @route    PUT /api/furniture/increment/:_id
// @access   private
const incrementFurniture = asyncHandler(async (req, res) => {
    const { id, quantity = 1 } = req.body;
    const furniture = await Furniture.findById(id);

    if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
    }

    const previousQuantity = furniture.quantity;
    const newQuantity = previousQuantity + quantity;

    // Save stock movement
    const stockMovement = new StockMovement({
        furnitureId: furniture._id,
        quantityChange: quantity,
        quantity: newQuantity,
        movementType: 'IN',
        modifiedBy: req.body.username,
        name: furniture.name
    });
    await stockMovement.save();

    // Update furniture quantity
    furniture.quantity = newQuantity;
    await furniture.save();

    res.status(200).json({
        message: `Quantity incremented. Current quantity: ${furniture.quantity}`,
        furniture,
    });
});

// @desc     Decrement furniture quantity
// @route    PUT /api/furniture/decrement/:_id
// @access   private
const decrementFurniture = asyncHandler(async (req, res) => {
    const { id, quantity = 1 } = req.body;
    const furniture = await Furniture.findById(id);

    if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
    }

    const previousQuantity = furniture.quantity;

    if (previousQuantity < quantity) {
        return res
            .status(400)
            .json({ message: "Insufficient stock. Quantity cannot be less than 0." });
    }

    const newQuantity = previousQuantity - quantity;

    // Save stock movement
    const stockMovement = new StockMovement({
        furnitureId: furniture._id,
        quantityChange: -quantity,
        quantity: newQuantity,
        movementType: 'OUT',
        modifiedBy: req.body.username,
        name: furniture.name
    });
    await stockMovement.save();

    // Update furniture quantity
    furniture.quantity = newQuantity;
    await furniture.save();

    res.status(200).json({
        message: `Quantity decremented. Current quantity: ${furniture.quantity}`,
        furniture,
    });
});

// @desc     Get furniture count
// @route    GET /api/furniture/count
// @access   Private
const getFurnitureCount = asyncHandler(async (req, res) => {
    try {
        const furnitureCount = await Furniture.countDocuments();
        res.status(200).json({ furnitureCount });
    } catch (error) {
        res.status(500).json({ message: "Error counting furniture", error: error.message });
    }
});

// @desc     Get today's movements
// @route    GET /api/furniture/today-movements
// @access   Private
const getTodayMovements = asyncHandler(async (req, res) => {
    try {
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const movementsToday = await StockMovement.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: null, totalMovements: { $sum: "$quantityChange" } } }
        ]);
        res.status(200).json({ count: movementsToday[0]?.totalMovements || 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @desc     Get most sold furniture
// @route    GET /api/furniture/most-sold
// @access   Private
const getMostSoldFurniture = asyncHandler(async (req, res) => {
    const mostSoldFurniture = await Furniture.find().sort({ movement: -1 }).limit(5);
    res.status(200).json(mostSoldFurniture);
});

// @desc     Get highest priced furniture
// @route    GET /api/furniture/highest-price
// @access   Private
const getHighestPriceFurniture = asyncHandler(async (req, res) => {
    const highestPriceFurniture = await Furniture.find().sort({ price: -1 }).limit(5);
    res.status(200).json(highestPriceFurniture);
});

// @desc     Get all furniture items
// @route    GET /api/furniture/inventory
// @access   private
const getAllFurniture = asyncHandler(async (req, res) => {
    try {
        const inventory = await Furniture.find({});
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch inventory', error: error.message });
    }
});

// @desc     Search furniture by name
// @route    GET /api/furniture/search/:name
// @access   private
const searchFurnitureByName = asyncHandler(async (req, res) => {
    try {
        const furniture = await Furniture.find({ name: { $regex: req.params.name, $options: 'i' } });
        res.status(200).json(furniture);
    } catch (error) {
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});

module.exports = {
    create,
    getFurniture,
    updateFurniture,
    deleteFurniture,
    incrementFurniture,
    decrementFurniture,
    getFurnitureCount,
    getTodayMovements,
    getMostSoldFurniture,
    getHighestPriceFurniture,
    getAllFurniture,
    searchFurnitureByName,
};