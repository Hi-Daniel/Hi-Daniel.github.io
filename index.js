const cube = document.getElementById('cube');
const header = document.getElementById('header');
const subtitle = document.getElementById('subtitle');
const xSlider = document.getElementById('x-slider');
const ySlider = document.getElementById('y-slider');
let isDragging = false;
let startX, startY;
let currentYRotation = 45;
let currentXRotation = 35;
let currentMat = matMult(rotX(currentYRotation), rotY(currentXRotation));

xSlider.style.background = 'linear-gradient(to right, #333 0%, #ccc 0%, #333 10%)';
ySlider.style.background = 'linear-gradient(to right, #333 0%, #ccc 0%, #333 10%)';

function updateSlider(slider, rotation){
    let mod360 = (rotation % 360 + 540) % 360;
    let percent = (mod360) * (100 / 360);
    slider.style.background = `linear-gradient(to right, #333 ${percent-10}%, #ccc ${percent}%, #333 ${percent+10}%)`;
}

function rotX(roll) {
    let rollRad = roll * Math.PI / 180;

    return [
        1, 0, 0, 0,
        0, Math.cos(rollRad), -Math.sin(rollRad), 0,
        0, Math.sin(rollRad), Math.cos(rollRad), 0,
        0, 0, 0, 1
    ]
}    

function rotZ(yaw) {
    let yawRad = yaw * Math.PI / 180;
    return [
        Math.cos(yawRad), -Math.sin(yawRad), 0, 0,
        Math.sin(yawRad), Math.cos(yawRad), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
}

function rotY(pitch){
    let pitchRad = pitch * Math.PI / 180;
    return [
        Math.cos(pitchRad), 0, Math.sin(pitchRad), 0,
        0, 1, 0, 0,
        -Math.sin(pitchRad), 0, Math.cos(pitchRad), 0,
        0, 0, 0, 1
    ]
}

function matMult(a, b) {
    let result = new Array(16).fill(0);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                result[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
            }
        }
    }
    return result;
}

cube.style.transform = `matrix3d(${currentMat})`;
updateSlider(xSlider, currentXRotation);
updateSlider(ySlider, currentYRotation);

let initialTouchTarget = null;

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
            xRotation = rotY(-deltaX);
            yRotation = rotX(deltaY);
            currentXRotation = currentXRotation + deltaX;
            currentYRotation = currentYRotation + deltaY;
            currentMat = matMult(currentMat, matMult(xRotation, yRotation));
            cube.style.transform = `matrix3d(${currentMat})`;
            updateSlider(xSlider, currentXRotation);
            updateSlider(ySlider, currentYRotation);
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