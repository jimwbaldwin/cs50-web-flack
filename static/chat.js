// Redirect to index if no display name set.
if (!localStorage.getItem('display_name')) {
  window.location.replace("/");
};


document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket.
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  
  // Save the current channel so we can return to the same channel after closing browser.
  localStorage.setItem('current_channel',channel);

  // When connected, configure buttons.
  socket.on('connect', () => {

    // Configure the message input box.
    document.querySelector('#form-chat-input').onsubmit = () => {
      // Send the message to the server.
      socket.emit('submit message', {"channel": channel
                , "display_name": localStorage.getItem('display_name')
                , "message": document.querySelector('#chat-input').value
              });

      // Clear input field.
      document.querySelector('#chat-input').value = '';
      
      // Stop page from reloading after send.
      return false;
    };

    // Configure the create channel box.
    document.querySelector('#form-create-channel').onsubmit = () => {
      // Send the new channel to the server to be created.
      socket.emit('create channel', {"channel": document.querySelector('#create-channel').value});
      // Clear the create channel input field.
      document.querySelector('#create-channel').value = '';
      // Stop form from submitting
      return false;
    };

    // On connect get the messages for the current channel.
    socket.emit('get messages', {"channel": channel});

  });

  // When a new message is received. Load the data.
  socket.on('channel messages', data => {
    // Turn the data string into useable JSON.
    var jsonData = JSON.parse(data);
    // If the messages are for the current channel, reload.
    if(channel == jsonData.channel) {
      // Delete the existing chat.
      myNode = document.querySelector('#chat-display')
      // Loop through the children and remove. There should only ever be one.
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
      // Create an unordered list to append the messages to.
      const ul  = document.createElement('ul');
      document.querySelector('#chat-display').append(ul);
  
      // Loop through the messages.
      for (var i = 0; i < jsonData.messages.length; i++) {
        // Get the message.
        var message = jsonData.messages[i];
        // Create the list item and spans to put the data in.
        var li = document.createElement('li')
        var spanUser = document.createElement('span')
        var spanMessage = document.createElement('span')
        var spanTime = document.createElement('span')
        // Set the span inner html and do some basic text formatting.
        spanUser.innerHTML = message.user + ': ';
        spanMessage.innerHTML = message.message + ' @ ';
        spanTime.innerHTML = message.time;
        // Put the spans in the list item.
        li.appendChild(spanUser);
        li.appendChild(spanMessage);
        li.appendChild(spanTime);
        // Put the list items in the unordered list.
        ul.appendChild(li);
      };
    } else {
      myNode = document.querySelector('#channel-id-' + jsonData.channel)
      if (!myNode.firstElementChild) {
        var spanBadge = document.createElement('span');
        spanBadge.setAttribute("class", "badge badge-secondary");
        spanBadge.innerHTML = 0;
        myNode.appendChild(spanBadge);
      };
      myNode.firstElementChild.innerHTML = Number(myNode.firstElementChild.innerHTML) + 1

    };

  });

  // Add the channel to the channel list.
  socket.on('add channel', data => {
    // Turn the data string into useable JSON.
    let jsonData = JSON.parse(data);
    // Create the list item element and add the class.
    let li = document.createElement('li');
    li.setAttribute("class", "nav-item");
    // Create the a element and add the attributes.
    let a  = document.createElement('a');
    a.setAttribute("href", "/chat/" + jsonData.channel);
    a.setAttribute("id", "channel-id-" + jsonData.channel);
    a.setAttribute("class", "nav-link");
    // Add the channel name to display.
    a.innerHTML = jsonData.channel;
    // Put the a tag in the list.
    li.appendChild(a);
    
    // Find the channel list element.
    let channel_list = document.querySelector('#channel-list');
    //Add the new li to the second last element in the list.
    channel_list.insertBefore(li, channel_list.lastChild.previousElementSibling);

  });
});
