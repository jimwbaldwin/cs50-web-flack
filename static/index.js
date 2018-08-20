if (localStorage.getItem('display_name')) {
  window.location.replace("/chat");
}

document.addEventListener('DOMContentLoaded', () => {
  // Set starting value of counter to 0

  document.querySelector('button').onclick = setDisplayName;

  function setDisplayName() {
    display_name = document.querySelector('#form_display_name').value;
    localStorage.setItem('display_name', display_name);
    window.location.replace("/chat");
  }


});
