const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

let app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

io.on('connection', (socket) => {
  console.log('Server: New User connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Invalid credentials');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the vartal-app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `"${params.name}" has joined`));
    callback();
  });

  socket.on('createMessage', (message) => {
    //console.log(`User: ${message.from}, said-> ${message.text} .`);
    //console.log('createMessage', message, message.from, '  ', message.text);
    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('createLocationMessage', (message) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', message.latitude, message.longitude));
  });

  socket.on('disconnect', () => {
    console.log('Server: User disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `"${user.name}" left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server started successfully at port:${port}`);
});
