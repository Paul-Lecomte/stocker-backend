const socketIo = require('socket.io');
const corsOptions = require('./corsOptions');

let io;
//ok so basically this is where the dark magic is beeing made we see when a new user is connected and disconnected
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