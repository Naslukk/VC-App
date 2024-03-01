const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle incoming socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle signaling between peers
    socket.on('offer', (data) => {
        console.log('Received offer from client:', data);
        socket.broadcast.emit('offer', data); // Send offer to other clients
    });

    socket.on('answer', (data) => {
        console.log('Received answer from client:', data);
        socket.broadcast.emit('answer', data); // Send answer to other clients
    });

    socket.on('iceCandidate', (data) => {
        console.log('Received ICE candidate from client:', data);
        socket.broadcast.emit('iceCandidate', data); // Send ICE candidate to other clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
