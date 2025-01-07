const mongoose = require('mongoose');

const aisleSchema = mongoose.Schema({
    location: {
        type: String,
        trim: true,
        unique: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Aisle', aisleSchema);