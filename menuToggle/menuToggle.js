const menuToggle = document.getElementById('menu-toggle');
const myMenu = document.getElementById('my-menu');

// Function to set cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// if toggle theme is found, add event listener
const toggleTheme = document.getElementById('toggle-theme');
if (toggleTheme) {
    toggleTheme.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        setDarkMode(isDark);
        // Save preference to cookie
        setCookie('theme-preference', isDark ? 'dark' : 'light', 365);
    });

    // Check for saved preference in cookie first
    const savedTheme = getCookie('theme-preference');
    if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
    } else {
        // If no saved preference, check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDarkMode);
        // Save system preference to cookie
        setCookie('theme-preference', prefersDarkMode ? 'dark' : 'light', 365);
    }

    function setDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        menuToggle.classList.toggle('dark-mode', isDark);
        toggleTheme.classList.toggle('dark-mode', isDark); 
        toggleTheme.innerHTML = isDark ? '&#9789;' : '&#9788;';
    }
    
    // Listen for system dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        setDarkMode(e.matches);
        // Save system preference to cookie when it changes
        setCookie('theme-preference', e.matches ? 'dark' : 'light', 365);
    });
}

menuToggle.addEventListener('click', () => {
    myMenu.style.opacity = myMenu.style.display === 'block' ? '0' : '1';
    myMenu.style.display = myMenu.style.display === 'block' ? 'none' : 'block';
});