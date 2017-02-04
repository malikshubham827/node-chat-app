const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message')

let app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Server: New User connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the vartal-app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
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
  });
});

server.listen(port, () => {
  console.log(`Server started successfully at port:${port}`);
});
