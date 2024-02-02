// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let pause = false;
// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    color: "#fff"
};

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
        this.initialSpeed = 10;
    }

    stop() {
        this.speed = 0;
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.speed = -this.initialSpeed;
                break;
            case 'down':
                this.speed = this.initialSpeed;
                break;
            default:
                break;
        }
    }

    update() {
        if (this.y <= 0) {
            this.y = 0;
        } else if (this.y >= canvas.height - this.height) {
            this.y = canvas.height - this.height;
        }
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const paddle1 = new Paddle(0, canvas.height / 2 - 60, 10, 120, "#fff");
const paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 60, 10, 120, "#fff");

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw paddles
function drawPaddles() {
    paddle1.draw();
    paddle2.draw();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
}

// Draw everything
function draw() {
    if (pause) {
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball and paddles
    drawBall();
    drawPaddles();

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Paddle movement
    paddle1.update();
    paddle2.update();

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < paddle1.x + paddle1.width) &&
        (ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height)
    ) {
        ball.speedX *= -1;
    } else if (
        (ball.x + ball.radius > paddle2.x) &&
        (ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height)
    ) {
        ball.speedX *= -1;
    }

    // Game over if ball goes beyond paddles
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        alert("Game Over!");
        resetBall();
    }
}

function handleKeyDown() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.length == 1 ?
            event.key.toLowerCase() : event.key
        switch (key) {
            case 'p':
            case ' ':
                pause = !pause;
                const pauseElement = document.getElementById('pause');
                if (pause)
                {
                    pauseElement.style.setProperty('display', 'block');
                } else {
                    pauseElement.style.setProperty('display', 'none');
                }
                break;
            case 'w':
                paddle1.move('up');
                break;
            case 's':
                paddle1.move('down');
                break;
            case 'ArrowUp':
                paddle2.move('up');
                break;
            case 'ArrowDown':
                paddle2.move('down');
                break;
            default:
                break ;
        }
    });
}

function handleKeyUp() {
    document.addEventListener('keyup', (event) => {
        const key = event.key.length == 1 ?
            event.key.toLowerCase() : event.key
        switch (key) {
            case 'w':
            case 's':
                paddle1.stop();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                paddle2.stop();
                break;
        }
    });
}

function handleKeyPress() {
    handleKeyDown();
    handleKeyUp();
}

handleKeyPress();

// Game loop
setInterval(draw, 1000 / 60);
