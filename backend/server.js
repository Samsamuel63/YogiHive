const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yogihive-chat', { useNewUrlParser: true, useUnifiedTopology: true });

const MessageSchema = new mongoose.Schema({
  room: String,
  user: String,
  text: String,
  time: String,
  badge: String,
  anonymous: Boolean,
  type: String,
  gifUrl: String,
  readBy: [String], // user emails or IDs
});
const Message = mongoose.model('Message', MessageSchema);

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

const roomUsers = {}; // { roomName: Set of socket.id }

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ room, user }) => {
    socket.join(room);
    if (!roomUsers[room]) roomUsers[room] = new Set();
    roomUsers[room].add(socket.id);

    // Send last 50 messages to the user
    const history = await Message.find({ room }).sort({ _id: 1 }).limit(50);
    socket.emit('chatHistory', history);

    // Broadcast presence
    io.to(room).emit('roomPresence', { count: roomUsers[room].size });

    // Save user info for typing/receipts
    socket.data = { room, user };
  });

  socket.on('leaveRoom', ({ room }) => {
    socket.leave(room);
    if (roomUsers[room]) {
      roomUsers[room].delete(socket.id);
      io.to(room).emit('roomPresence', { count: roomUsers[room].size });
    }
  });

  socket.on('chatMessage', async ({ room, message }) => {
    const saved = await Message.create({ ...message, room, readBy: [message.user] });
    io.to(room).emit('chatMessage', saved);
  });

  socket.on('typing', ({ room, user }) => {
    socket.to(room).emit('typing', user);
  });

  socket.on('readMessages', async ({ room, user }) => {
    // Mark all messages in room as read by this user
    await Message.updateMany({ room, readBy: { $ne: user } }, { $push: { readBy: user } });
    // Optionally, send updated read receipts
    const updated = await Message.find({ room }).sort({ _id: 1 }).limit(50);
    io.to(room).emit('chatHistory', updated);
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (roomUsers[room]) {
        roomUsers[room].delete(socket.id);
        io.to(room).emit('roomPresence', { count: roomUsers[room].size });
      }
    }
  });
});

server.listen(5001, () => console.log('Server running on 5001')); 