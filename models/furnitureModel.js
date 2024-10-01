const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema({
    furniture_name: {
        type: String,
        required: true,
        trim: true
    },
    furniture_quantity: {
        type: Number,
        trim: true,
        default: 0
    },
    furniture_price: {
        type: Number,
        trim: true,
        default: 2000
    },
    furniture_description: {
        type: String,
        required: true,
        trim: true
    },
    furniture_location: {
        type: String,
        required: true,
        trim: true
    },
    furniture_movement: {
        type : Number
    }
})

module.exports = mongoose.model('Furniture', furnitureSchema);