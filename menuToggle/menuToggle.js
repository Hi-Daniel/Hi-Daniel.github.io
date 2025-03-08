const menuToggle = document.getElementById('menu-toggle');
const myMenu = document.getElementById('my-menu');


// if toggle theme is found, add event listener
const toggleTheme = document.getElementById('toggle-theme');
if (toggleTheme) {
    toggleTheme.addEventListener('click', () => {
        setDarkMode(!document.body.classList.contains('dark-mode'));
    });
    // Check if browser prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Set initial icon based on system preference
    setDarkMode(prefersDarkMode);
    function setDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        menuToggle.classList.toggle('dark-mode', isDark);
        toggleTheme.classList.toggle('dark-mode', isDark); 
        toggleTheme.innerHTML = isDark ? '&#9789;' : '&#9788;';
    }
    
    
    // Listen for system dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        setDarkMode(e.matches);
    });
}
menuToggle.addEventListener('click', () => {
    myMenu.style.opacity = myMenu.style.display === 'block' ? '0' : '1';
    myMenu.style.display = myMenu.style.display === 'block' ? 'none' : 'block';
});



