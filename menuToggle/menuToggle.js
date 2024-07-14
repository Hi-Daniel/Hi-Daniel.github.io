const menuToggle = document.getElementById('menu-toggle');
const myMenu = document.getElementById('my-menu');

menuToggle.addEventListener('click', () => {
    myMenu.style.opacity = myMenu.style.display === 'block' ? '0' : '1';
    myMenu.style.display = myMenu.style.display === 'block' ? 'none' : 'block';
});
