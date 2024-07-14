const cube = document.getElementById('cube');
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    startY = e.pageY;

});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = (e.pageX - startX) / window.innerWidth * 360;
        const deltaY = (e.pageY - startY) / window.innerHeight * 360;
        currentX += deltaX;
        currentY -= deltaY;
        cube.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        startX = e.pageX;
        startY = e.pageY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mouseleave', () => {
    isDragging = false;
});