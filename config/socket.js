const socketIo = require('socket.io');
const corsOptions = require('./corsOptions');

const initializeSocket = (server) => {
    const io = socketIo(server, {
        cors: corsOptions
    });

    io.on('connection', (socket) => {
        console.log('Nouveau client connecté');

        // Exemples d'émission de notification
        socket.on('trigger-notification', (data) => {
            console.log('Notification data:', data);
            io.emit('stock-level-notification', data);
        });

        socket.on('disconnect', () => {
            console.log('Client déconnecté');
        });
    });

    // No need to export io here
};

module.exports = { initializeSocket };