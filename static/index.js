if (!localStorage.getItem('current_channel')) {
  localStorage.setItem('current_channel','general');
};

if (localStorage.getItem('display_name')) {
  const channel = localStorage.getItem('current_channel');
  window.location.replace("/chat/" + channel);
};

document.addEventListener('DOMContentLoaded', () => {
  // Set starting value of counter to 0
  const channel = localStorage.getItem('current_channel');
  document.querySelector('button').onclick = setDisplayName;

  function setDisplayName() {
    display_name = document.querySelector('#form_display_name').value;
    localStorage.setItem('display_name', display_name);
    window.location.replace("/chat/" + channel);
  }

});
