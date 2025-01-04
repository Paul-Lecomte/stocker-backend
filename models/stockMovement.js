const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    furnitureId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantityChange: {
        type: Number,
        required: true
    },
    movementType: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    modifiedBy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

// Only define the model if it doesn't already exist
const StockMovement = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;
