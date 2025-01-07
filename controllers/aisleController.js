const Aisle = require('../models/aisleModel');

// Create a new aisle
const createAisle = async (req, res) => {
    try {
        const { location } = req.body;
        const aisle = new Aisle({ location });
        await aisle.save();
        res.status(201).json(aisle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an aisle by ID
const deleteAisle = async (req, res) => {
    try {
        const { id } = req.params;
        const aisle = await Aisle.findByIdAndDelete(id);
        if (!aisle) return res.status(404).json({ message: 'Aisle not found' });
        res.status(200).json({ message: 'Aisle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller to fetch all aisles
const getAllAisles = async (req, res) => {
    try {
        const aisles = await Aisle.find(); // Fetch all aisles
        res.status(200).json(aisles); // Send aisles as JSON response
    } catch (error) {
        console.error("Error fetching aisles:", error);
        res.status(500).json({ message: "Failed to fetch aisles" });
    }
};

module.exports = {
    createAisle,
    deleteAisle,
    getAllAisles
};