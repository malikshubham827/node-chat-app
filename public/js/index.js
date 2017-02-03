var socket = io();
socket.on('connect', function() {
  console.log('Client: Connected to server');
});

socket.on('newMessage', function(message) {
  //console.log('User:', message.from, 'said=', message.text, ' at timeStamp: ', message.time);
  console.log('newMessage', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('disconnect', function() {
  console.log('Client: disconnected from server');
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'Frank',
    text: $('[name="message"]').val()
  }, function() {
    console.log('Got something from server');
  });
  $('[name=message]').val('');
  // setTimeout(function() {
  //   $('[name="message"]').val('')
  // }, 1000);
});
