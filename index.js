const cube = document.getElementById('cube');
const header = document.getElementById('header');
const subtitle = document.getElementById('subtitle');
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

const facecontainers = document.querySelectorAll('.face-container');
facecontainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
        header.textContent = 'Go To:';
        subtitle.textContent = container.dataset.face;
    });
    container.addEventListener('mouseleave', () => {
        header.textContent = 'Welcome to my Website!';
        subtitle.textContent = 'hover over a face of the cube to explore my page';
    });
    container.addEventListener('click', () => {
        window.location.href = container.dataset.link;
    })
})