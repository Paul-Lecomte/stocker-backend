const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel');
const Furniture = require('../models/furnitureModel');
const { io } = require('../config/socket');

// @desc     Create a new notification
// @route    POST /api/notifications
// @access   Private
const createNotification = asyncHandler(async (req, res) => {
    const { name, userId, furnitureId, threshold, comparison, email } = req.body;

    // Validate required fields
    if (!userId || !furnitureId || !threshold || !comparison) {
        res.status(400);
        throw new Error('All fields are required');
    }

    const numericThreshold = Number(threshold);

    if (isNaN(numericThreshold)) {
        res.status(400);
        throw new Error('Threshold must be a number');
    }

    const notification = await Notification.create({
        name,
        userId,
        furnitureId,
        threshold,
        comparison,
        email
    });

    if (!notification) {
        res.status(400);
        throw new Error('Failed to create notification');
    }

    res.status(201).json({ message: 'Notification created successfully', notification });
});

// @desc     Delete a notification by ID
// @route    DELETE /api/notifications/:id
// @access   Private
const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find and delete the notification by ID
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
});

// @desc     Get all notifications (Admin or debugging purposes)
// @route    GET /api/notifications/all
// @access   Private (Admin)
const getAllNotifications = asyncHandler(async (req, res) => {
    // Fetch all notifications with populated user and furniture data
    const notifications = await Notification.find()
        .populate('userId', 'first_name last_name email')
        .populate('furnitureId', 'name quantity')
        .select('name userId furnitureId threshold comparison isTriggered createdAt updatedAt');

    if (!notifications.length) {
        res.status(404);
        throw new Error('No notifications found');
    }

    res.status(200).json(notifications);
});

// @desc     Get notifications for a specific user
// @route    GET /api/notifications/user/:userId
// @access   Private
const getUserNotifications = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Convert userId to ObjectId (use 'new' here)
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Fetch notifications for the given user ID
    const notifications = await Notification.find({ userId: objectIdUserId })
        .populate('furnitureId', 'name quantity');

    if (!notifications.length) {
        res.status(404);
        throw new Error('No notifications found for this user');
    }

    res.status(200).json(notifications);
});

// @desc     Update a notification by ID
// @route    PUT /api/notifications/:id
// @access   Private
const updateNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find the notification by ID and update it
    const updatedNotification = await Notification.findByIdAndUpdate(id, req.body, {
        new: true, // Return the updated document
    });

    if (!updatedNotification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.status(200).json({
        message: 'Notification updated successfully',
        updatedNotification,
    });
});

// Function to check and update the trigger status of notifications based on stock levels
const updateNotificationTriggerStatus = async (furnitureId, threshold, comparison) => {
    const furniture = await Furniture.findById(furnitureId);

    if (!furniture) {
        throw new Error('Furniture not found');
    }

    let isTriggered = false;

    console.log(`Checking stock level for ${furniture.name} (quantity: ${furniture.quantity}) with threshold ${threshold} and comparison ${comparison}`);

    // Compare stock levels with the threshold
    if (comparison === 'LESS_THAN' && furniture.quantity < threshold) {
        isTriggered = true;
    } else if (comparison === 'GREATER_THAN' && furniture.quantity > threshold) {
        isTriggered = true;
    }

    // Log if triggered
    console.log(`Notification triggered: ${isTriggered}`);

    // Update notifications based on the trigger condition
    await Notification.updateMany(
        { furnitureId, isTriggered: false },  // Avoid updating already triggered notifications
        { isTriggered: isTriggered }
    );

    // Emit Socket.IO event to notify all connected clients if the condition is met
    if (isTriggered) {
        console.log(`Emitting notification for ${furniture.name}`);
        io.emit('notificationTriggered', { furnitureId, isTriggered, message: `Stock level for ${furniture.name} is below the threshold!` });
    } else {
        console.log(`No notification triggered for ${furniture.name}`);
    }
};

module.exports = {
    createNotification,
    deleteNotification,
    getAllNotifications,
    getUserNotifications,
    updateNotification,
    updateNotificationTriggerStatus,
};