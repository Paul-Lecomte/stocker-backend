const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema({
    furniture_id: {
        type: String,
        required: true,
        increment:true
    },
    furniture_name: {
        type: String,
        required: true,
        trim: true
    },
    furniture_quantity: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    furniture_price: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    furniture_number_sold: {
        type: Number,
        required: true,
        trim: true,
        default: 0
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
    }
})

module.exports = mongoose.model('Furniture', furnitureSchema);