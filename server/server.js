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

  socket.on('disconnect', () => {
    console.log('Server: User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server started successfully at port:${port}`);
});
