document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggler
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const body = document.body;

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('focusflow-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('focusflow-theme', 'light');
      themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      localStorage.setItem('focusflow-theme', 'dark');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // Chat Panel Toggler
  const chatToggleBtn = document.getElementById('chatToggleBtn');
  const chatPanel = document.getElementById('chatPanel');

  chatToggleBtn.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
  });
});
