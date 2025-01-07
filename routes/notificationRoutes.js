const express = require('express');
const {
    createNotification,
    deleteNotification,
    getAllNotifications,
    getUserNotifications,
    updateNotification
} = require('../controllers/notificationController');

const router = express.Router();

// Route to create a new notification
router.post('/', createNotification);

// Route to delete a notification by ID
router.delete('/:id', deleteNotification);

// Route to fetch all notifications (admin or for debugging)
router.get('/all', getAllNotifications);

// Route to fetch notifications for a specific user
router.get('/user/:userId', getUserNotifications);

// Route to update a notification by ID (e.g., mark as read or modify)
router.put('/:id', updateNotification);

module.exports = router;