const mongoose = require('mongoose');

const furnitureSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
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
        type : Number,
        default : function (){
            return this.quantity;
        }
    }
})

module.exports = mongoose.model('Furniture', furnitureSchema);