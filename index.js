const cube = document.getElementById('cube');
const header = document.getElementById('header');
const subtitle = document.getElementById('subtitle');
const menuToggle = document.getElementById('menu-toggle');
const myMenu = document.getElementById('my-menu');
let isDragging = false;
let startX, startY;
let currentX = 135; let currentY = 45;
let initialTouchTarget = null;


menuToggle.addEventListener('click', () => {
    myMenu.style.opacity = myMenu.style.display === 'block' ? '0' : '1';
    myMenu.style.display = myMenu.style.display === 'block' ? 'none' : 'block';
});

function handleStart(e) {
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    startY = e.pageY || e.touches[0].pageY;
    initialTouchTarget = e.target;
}

function handleMove(e) {
    if (isDragging) {
        const pageX = e.pageX || e.touches[0].pageX;
        const pageY = e.pageY || e.touches[0].pageY;
        if (pageX !== undefined && pageY !== undefined) {
            const deltaX = (pageX - startX) / window.innerWidth * 360;
            const deltaY = (pageY - startY) / window.innerHeight * 360;
            currentX += deltaX;
            currentY -= deltaY;
            cube.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
            startX = pageX;
            startY = pageY;
        }
    }
}

function handleEnd(e){
    isDragging = false;
    if (initialTouchTarget && e.target === initialTouchTarget) {
        if (initialTouchTarget.closest('.face-container')) {
            window.location.href = initialTouchTarget.closest('.face-container').dataset.link;
        }
    }
    initialTouchTarget = null;
}

document.addEventListener('mousedown', handleStart);
document.addEventListener('mousemove', handleMove);
document.addEventListener('mouseup', handleEnd);
document.addEventListener('mouseleave', handleEnd);

document.addEventListener('touchstart', handleStart);
document.addEventListener('touchmove', handleMove);
document.addEventListener('touchend', handleEnd);

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
    });
    container.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        header.textContent = 'Go To:';
        subtitle.textContent = container.dataset.face;
    });
    container.addEventListener('touchend', (e) => {
        e.stopPropagation();
        if (initialTouchTarget && e.target === initialTouchTarget) {
            window.location.href = container.dataset.link;
        }
        else {
            header.textContent = 'Welcome to my Website!';
            subtitle.textContent = 'hover over a face of the cube to explore my page';
        }
    });
})