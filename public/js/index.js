let socket = io();
socket.on('connect', function() {
  console.log('Client: Connected to server');
});

socket.on('newMessage', function(message) {
  //console.log('User:', message.from, 'said=', message.text, ' at timeStamp: ', message.time);
  console.log('newMessage', message);
});

socket.on('disconnect', function() {
  console.log('Client: disconnected from server');
});
