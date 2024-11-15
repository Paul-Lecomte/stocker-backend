const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        trim: true,
        default: 0
    },
    price: {
        type: Number,
        trim: true,
        default: 2000
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        trim: true
    },
    movement: {
        type: Number,
        default: 0
    },
    picture: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Middleware to update movement on quantity change
furnitureSchema.pre('save', function(next) {
    if (this.isModified('quantity')) {
        this.movement = this.quantity;
    }
    next();
});

module.exports = mongoose.model('Furniture', furnitureSchema);
