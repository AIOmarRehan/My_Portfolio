// Prevent flash of wrong theme on page load
(function() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode')
  }
})()
