const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

let app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));
let server = http.createServer(app);
let io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Server: New User connected');

  socket.emit('newMessage', {
    from: 'admin',
    text: 'Welcome!!',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });
  socket.on('createMessage', (message) => {
    //console.log(`User: ${message.from}, said-> ${message.text} .`);
    //console.log('createMessage', message, message.from, '  ', message.text);

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

  });

  socket.emit('newMessage', {
    'from': 'user1@example.com',
    'text': 'text of the message',
    'time': 123
  });

  socket.on('disconnect', () => {
    console.log('Server: User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started successfully at port:${port}`);
});
