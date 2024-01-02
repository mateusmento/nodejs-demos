const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
const http = createServer(app);
const websockets = new Server(http);

app.use(cors({ origin: '*' }));

app.get("/", (req, res) => {
    res.redirect(`/${uuid()}`);
});

app.use(express.static('./'));

app.get("/:meetingId", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

websockets.on('connection', (socket) => {
    socket.on('join-meeting', ({ meetingId, peerId }) => {
        const roomId = `meeting:${meetingId}`;
        socket.join(roomId);
        socket.to(roomId).emit('attendee-joined', { peerId });
        socket.on('disconnect', () => {
            socket.to(roomId).emit('attendee-left', { peerId });
        });
        socket.on('leave-meeting', () => {
            socket.to(roomId).emit('attendee-left', { peerId });
        });
    });
});

http.listen(3000);
