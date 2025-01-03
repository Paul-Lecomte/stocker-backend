const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    furnitureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Furniture', required: true },
    threshold: { type: Number, required: true },
    comparison: { type: String, enum: ['LESS_THAN', 'GREATER_THAN'], required: true },
    isTriggered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);