const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 9000;
const botName = 'ChatCord Bot';

// set static folder

app.use(express.static(path.join(__dirname, 'public')));

// run when client connects
io.on('connection', (socket) => {
  // sending request from the server

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(room);
    // welcome user message
    // socket.emit will broadcast to only that client
    //   socket.emit('message', 'Welcome to chatRoom');
    socket.emit('message', formatMessage(botName, 'Welcome to chatRoom'));

    // Broadcast when a user connects
    // BROADCAST means it will emit to to everyone except that client
    socket.broadcast
      .to(room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // LISTEN FOR CHAT MESSAGE
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(msg);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // RUNS when the client disconnects
  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id);
    userLeave(user.id);

    io.to(user.room).emit(
      'message',
      formatMessage(botName, `${user.username}  has left the chat`)
    );

    // Send user and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
