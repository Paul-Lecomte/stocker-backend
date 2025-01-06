const socketIo = require('socket.io');
const corsOptions = require('./corsOptions');

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: corsOptions,
    });

    io.on('connection', (socket) => {
        console.log('Nouveau client connecté');

        socket.on('disconnect', () => {
            console.log('Client déconnecté');
        });
    });

    console.log('Socket.IO initialized');
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = { initializeSocket, getIo };