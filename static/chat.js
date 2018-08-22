if (!localStorage.getItem('display_name')) {
  window.location.replace("/");
}

document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected, configure buttons
  socket.on('connect', () => {

    document.querySelector('#form-chat-input').onsubmit = () => {
      socket.emit('submit message', {"channel": "general"
                , "display_name": localStorage.getItem('display_name')
                , "message": document.querySelector('#chat-input').value
              });

      // Clear input field
      document.querySelector('#chat-input').value = '';
      
      // Stop form from submitting
      return false;
    };
  });
  // When a new vote is announced, add to the unordered list
  socket.on('channel messages', data => {
    const ul  = document.createElement('ul');
    myNode = document.querySelector('#chat-display')
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    document.querySelector('#chat-display').append(ul);

    var jsonData = JSON.parse(data);
    for (var i = 0; i < jsonData.length; i++) {
        var message = jsonData[i];
        var li = document.createElement('li')
        li.innerHTML = message.message;
        ul.appendChild(li)
        console.log(message.message);
    };
    
    // Add paragraph to display
    
    //document.querySelector('#yes').innerHTML = data.yes;
    //document.querySelector('#no').innerHTML = data.no;
    //document.querySelector('#maybe').innerHTML = data.maybe;
  });
});
