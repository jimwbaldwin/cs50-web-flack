// Set the current channel to be general if none is set.
if (!localStorage.getItem('current_channel')) {
  localStorage.setItem('current_channel','general');
};

// Send the user to their current channel if they have set a display name previously.
if (localStorage.getItem('display_name')) {
  const channel = localStorage.getItem('current_channel');
  window.location.replace("/chat/" + channel);
};


document.addEventListener('DOMContentLoaded', () => {
  // Get the current channel from local storage.
  const channel = localStorage.getItem('current_channel');
  // Set the set name button to run the JS function setDisplayName.
  document.querySelector('#set_name').onclick = setDisplayName;

  function setDisplayName() {
    // Get the display name from the form.
    var display_name = document.querySelector('#form_display_name').value;
    // Set the display name to local storage.
    localStorage.setItem('display_name', display_name);
    // Send the client to their current channel chat page.
    window.location.replace("/chat/" + channel);
  }

});
