if (!localStorage.getItem('display_name')) {
  window.location.replace("/");
}

document.addEventListener('DOMContentLoaded', () => {

  document.querySelector('#form-chat-input').onsubmit = () => {
    const p  = document.createElement('p');
    p.innerHTML = document.querySelector('#chat-input').value;

    // Add paragraph to display
    document.querySelector('#chat-display').appendChild(p);

    // Clear input field
    document.querySelector('#chat-input').value = '';
    
    // Stop form from submitting
    return false;
  };
});
