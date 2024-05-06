import express from 'express';
import http from 'http';
import { Server as socketserver } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new socketserver(server, {
    cors: {
        origin: '*',
    }
});

const rooms = ['general', 'random']; // Lista de salas disponibles

io.on('connection', async (socket) => {
    const id = socket.id;
    console.log('A user connected');

    socket.emit('availableRooms', rooms); // Enviar lista de salas disponibles al cliente

    socket.on('message', (msg) => {
        io.to(room).emit('message', {
            body: msg.body,
            from: msg.user,
        });
    });

    socket.on('joinRoom', (roomName) => {
        socket.leaveAll();
        socket.join(roomName);
        console.log(`User joined room: ${roomName}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/test', (req, res) => {
    res.send('Test');
});

server.listen(5172, () => {
    console.log('Server is running on http://localhost:5172');
});
