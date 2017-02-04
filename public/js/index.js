'use strict';
var socket = io();
socket.on('connect', function() {
  console.log('Client: Connected to server');
});

var messages = $('#messages');
socket.on('newMessage', function(message) {
  //console.log('User:', message.from, 'said=', message.text, ' at timeStamp: ', message.time);
  console.log('newMessage', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  // $('#messages').append(li);
  messages.append(li);
});

socket.on('disconnect', function() {
  console.log('Client: disconnected from server');
});

var intervalId ;
var geolocationBtn = $('#geolocation-btn');

var resetGeoButtonText = function () {
  clearInterval(intervalId);
  geolocationBtn.text('Send Geolocation');
}
socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My Location</a>');
  li.text(`${message.from}:`);
  a.attr('href', message.url);
  li.append(a);
  messages.append(li);
  resetGeoButtonText();
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
});

var geoSuccess = function (position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  socket.emit('createLocationMessage', {
    latitude,
    longitude
  });
}

var geoError = function () {
  alert('Could not retreive your location');
}

geolocationBtn.on('click', function() {
  if (!navigator.geolocation) {
    alert('Your browsert does not support Geolocation facility');
    return ;
  }

  var newText = 'Fetching';
  geolocationBtn.text(newText);
  intervalId = setInterval(function() {
    var curText = geolocationBtn.text();
    if (curText == 'Fetching...') {
      newText = 'Fetching';
    } else {
      newText += '.';
    }
    geolocationBtn.text(newText);
  },500);
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

});
