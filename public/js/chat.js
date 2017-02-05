'use strict';

//-----------------------------
//TODO
function scrollToBottom() {
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  console.log('clientHeight: ', clientHeight);
  console.log('offsetheight: ', messages.prop('offsetHeight'));
  console.log('scrollTop: ', scrollTop);
  console.log('scrollHeight ', scrollHeight);
  console.log('newMessageHeight: ', newMessageHeight);
  console.log('lastMessageHeight: ', lastMessageHeight);

  if (scrollTop + clientHeight + lastMessageHeight + newMessageHeight >= scrollHeight) {
    console.log('Should scroll');
  }
}
//----------------------------

var socket = io();
socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {

    }
  });
});


var messages = $('#messages');
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    text: message.text
  });
  messages.append(html);
  scrollToBottom();
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
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  messages.append(html);
  resetGeoButtonText();
  scrollToBottom();
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
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

socket.on('updateUserList', function(users) {
  var ol = $('<ol></ol>');
  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });
  $('#users').html(ol);
});

socket.on('disconnect', function() {
  console.log('Client: disconnected from server');
});
