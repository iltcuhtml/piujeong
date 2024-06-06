const canvas = document.getElementById('meditationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

const ball = {
    x: canvas.width / 2,
    y: canvas.height,
    radius: 25,
    color: '#FAED7D' 
};

function drawBackground() {
    ctx.fillStyle = '#000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawText(text) {
    ctx.fillStyle = '#0900FF';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawBallPosition() {
    ctx.fillStyle = '#3498db'; 
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    
}

function startAnimation() {
    const timeInput = document.getElementById('timeInput');
    const duration = parseInt(timeInput.value) * 1000;
    const halfDuration = duration / 2;

    let startTime = null;
    let direction = 'up';

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        drawBackground();
        drawBall();

        if (direction === 'up') {
            ball.y = canvas.height - (canvas.height * (elapsed / halfDuration));
            drawText('Breathe In');
        } else {
            ball.y = canvas.height * (elapsed / halfDuration);
            drawText('Breathe Out');
        }

        if (elapsed >= halfDuration) {
            startTime = timestamp;
            direction = direction === 'up' ? 'down' : 'up';
        }

        drawBallPosition();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}


drawBackground();
drawBall();
drawBallPosition();
