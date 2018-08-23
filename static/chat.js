if (!localStorage.getItem('display_name')) {
  window.location.replace("/");
};


document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  
  localStorage.setItem('current_channel',channel);

  // When connected, configure buttons
  socket.on('connect', () => {

    document.querySelector('#form-chat-input').onsubmit = () => {
      socket.emit('submit message', {"channel": channel
                , "display_name": localStorage.getItem('display_name')
                , "message": document.querySelector('#chat-input').value
              });

      // Clear input field
      document.querySelector('#chat-input').value = '';
      
      // Stop form from submitting
      return false;
    };

    socket.emit('get messages', {"channel": channel});
    return false;
  });

  // When a new vote is announced, add to the unordered list
  socket.on('channel messages', data => {
    var jsonData = JSON.parse(data);
    if(channel == jsonData.channel) {
      const ul  = document.createElement('ul');
      myNode = document.querySelector('#chat-display')
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
      document.querySelector('#chat-display').append(ul);
  
      
      for (var i = 0; i < jsonData.messages.length; i++) {
          var message = jsonData.messages[i];
          var li = document.createElement('li')
          var spanUser = document.createElement('span')
          var spanMessage = document.createElement('span')
          var spanTime = document.createElement('span')
          spanUser.innerHTML = message.user + ': ';
          spanMessage.innerHTML = message.message + ' @ ';
          spanTime.innerHTML = message.time;
          li.appendChild(spanUser);
          li.appendChild(spanMessage);
          li.appendChild(spanTime);
          ul.appendChild(li)
      };
    };
    return false;
  });
});
