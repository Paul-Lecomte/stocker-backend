const asyncHandler = require('express-async-handler');
const Furniture = require('../models/furnitureModel');
const StockMovement = require('../models/stockMovement');

// @desc     Creation des furnitures
// @route    POST /api/furniture/create
// @access   private
const create = asyncHandler(async (req, res) => {
    const { name, quantity, price, description, location, movement } = req.body;
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

    // We save the furniture in the DB
    const furniture = await Furniture.create({
        name,
        quantity,
        price,
        description,
        location,
        movement
    });

    if (furniture) {
        res.status(201).json({
            _id: furniture._id,
            name: furniture.name,
            quantity: furniture.quantity,
            price: furniture.price,
            description: furniture.description,
            location: furniture.location,
            movement: furniture.movement
        });
    } else {
        res.status(400);
        throw new Error('Fatal error please try again');
    }
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
            movement: furniture.movement
        });
    } else {
        res.status(400);
        throw new Error('Error furniture does not exist');
    }
});

// @desc     Update furniture info
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

    // Check for quantity change to log it
    if (newQuantity !== previousQuantity) {
        const quantityChange = newQuantity - previousQuantity;
        const movementType = quantityChange > 0 ? "IN" : "OUT";

        // Log the stock movement
        const stockMovement = new StockMovement({
            furnitureId: furniture._id,
            quantityChange,            // Added quantityChange field here
            quantity: newQuantity,      // Updated quantity to match schema
            movementType,
        });
        await stockMovement.save();
        console.log("Stock movement saved:", stockMovement);

        // Update quantity in the furniture model
        furniture.quantity = newQuantity;
    }

    // Update other fields
    furniture.name = req.body.name || furniture.name;
    furniture.price = req.body.price || furniture.price;
    furniture.description = req.body.description || furniture.description;
    furniture.location = req.body.location || furniture.location;
    furniture.movement = req.body.movement || furniture.movement;

    await furniture.save();

    res.status(200).json({
        _id: furniture._id,
        name: furniture.name,
        quantity: furniture.quantity,
        price: furniture.price,
        description: furniture.description,
        location: furniture.location,
        movement: furniture.movement,
    });
});

// @desc     Delete furniture item
// @route    DELETE /api/furniture/delete/:_id
// @access   private
const deleteFurniture = asyncHandler(async (req, res) => {
    const furniture = await Furniture.findById(req.params._id);
    if (!furniture) {
        res.status(404);
        throw new Error("Furniture item not found");
    }

    // Use findByIdAndDelete instead of remove
    await Furniture.findByIdAndDelete(req.params._id);

    res.status(200).json({ message: "Furniture item deleted successfully" });
});


// @desc     Increment furniture quantity
// @route    PUT /api/furniture/increment/:_id
// @access   private
const incrementFurniture = asyncHandler(async (req, res) => {
    const { id, quantity = 1 } = req.body;  // Assuming quantity is passed in the request body
    const furniture = await Furniture.findById(id);

    if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
    }

    // Increment stock level
    furniture.quantity += quantity;
    await furniture.save();

    // Log the stock movement
    const stockMovement = new StockMovement({
        furnitureId: id,
        quantityChange: quantity,
        movementType: 'IN',
    });
    await stockMovement.save();

    res.status(200).json({ message: `Quantity incremented. Current quantity: ${furniture.quantity}`, furniture });
});

// @desc     Decrement furniture quantity
// @route    PUT /api/furniture/decrement/:_id
// @access   private
const decrementFurniture = asyncHandler(async (req, res) => {
    const { id, quantity = 1 } = req.body;  // Assuming quantity is passed in the request body
    const furniture = await Furniture.findById(id);

    if (!furniture) {
        return res.status(404).json({ message: "Furniture not found" });
    }

    // Prevent quantity from going below 0
    if (furniture.quantity >= quantity) {
        // Decrement stock level
        furniture.quantity -= quantity;
        await furniture.save();

        // Log the stock movement
        const stockMovement = new StockMovement({
            furnitureId: id,
            quantityChange: -quantity,
            movementType: 'OUT',
        });
        await stockMovement.save();

        res.status(200).json({ message: `Quantity decremented. Current quantity: ${furniture.quantity}`, furniture });
    } else {
        return res.status(400).json({ message: "Quantity cannot be less than 0" });
    }
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
// @route    GET /api/furniture/search
// @access   private
const searchFurnitureByName = asyncHandler(async (req, res) => {
    const searchQuery = req.query.name;

    // Check if search query is provided
    if (!searchQuery) {
        res.status(400);
        throw new Error("Please provide a search term.");
    }

    try {
        // Find furniture items where the name contains the search query (case-insensitive)
        const foundFurniture = await Furniture.find({
            name: { $regex: searchQuery, $options: 'i' }, // 'i' makes it case-insensitive
        });

        // If furniture items are found, return them
        if (foundFurniture.length > 0) {
            res.status(200).json(foundFurniture);
        } else {
            // If no furniture items are found, return a 404 with a message
            res.status(404).json({ message: "No furniture found" });
        }
    } catch (error) {
        // Log error to console for debugging
        console.error("Error while searching furniture:", error);

        // Send a 500 response if there is an error during the search
        res.status(500).json({ message: "Error while searching furniture", error: error.message });
    }
});


// @desc     Get all furniture items with their movements
// @route    GET /api/stock-movements/all
// @access   Private
const getAllFurnitureWithMovements = async (req, res, next) => {
    try {
        // Fetch all furniture items
        const furnitureItems = await Furniture.find();

        // Map over each furniture item to fetch their movements
        const furnitureWithMovements = await Promise.all(
            furnitureItems.map(async (furniture) => {
                const movements = await StockMovement.find({ furnitureId: furniture._id }).sort({ createdAt: 1 });
                return { ...furniture.toObject(), movements };
            })
        );

        res.json(furnitureWithMovements);
    } catch (error) {
        console.error("Error fetching furniture and movements:", error);
        next(error);
    }
};


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
    getAllFurnitureWithMovements,
};
