'use strict';

var socket = io();
socket.on('connect', function() {
  console.log('Client: Connected to server');
});

var messages = $('#messages');
socket.on('newMessage', function(message) {
  //console.log('User:', message.from, 'said=', message.text, ' at timeStamp: ', message.time);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // console.log('newMessage', message);
  var li = $('<li></li>');
  li.text(`${message.from} [${formattedTime}]: ${message.text}`);
  // $('#messages').append(li);
  messages.append(li);
});

socket.on('disconnect', function() {
  console.log('Client: disconnected from server');
});

var intervalId, timeoutBannerId, vexAlertId, watchId ;
var geolocationBtn = $('#send-location');

var resetGeoButtonText = function () {
  clearInterval(intervalId);
  geolocationBtn.text('Send Geolocation');
  geolocationBtn.attr('disabled', false);
}
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  var a = $('<a target="_blank">My Location</a>');
  li.text(`${message.from} [${formattedTime}]:`);
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
  clearTimeout(timeoutBannerId);
  navigator.geolocation.clearWatch(watchId);
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  socket.emit('createLocationMessage', {
    latitude,
    longitude
  });

}

var geoError = function (e) {
  clearTimeout(timeoutBannerId);
  navigator.geolocation.clearWatch(watchId);
  resetGeoButtonText();
  vex.dialog.alert('Could not retreive your location\n' + e.message);
}

var showBanner = function() {
  resetGeoButtonText();
  navigator.geolocation.clearWatch(watchId);
  vexAlertId = vex.dialog.alert('Sorry, could not fetch location[TIMEOUT]');
}

// var hideBanner = function() {
//   resetGeoButtonText();
//   try {
//     vex.close(vexAlertId);
//   } catch (e) {
//
//   };
// }

geolocationBtn.on('click', function() {
  if (!navigator.geolocation) {
    vex.dialog.alert('Your browsert does not support Geolocation facility');
    return ;
  }
  timeoutBannerId = setTimeout(showBanner,10*1000);
  geolocationBtn.attr('disabled', true);

  // butto animation
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

  watchId = navigator.geolocation.watchPosition(geoSuccess, geoError);

});
