// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


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

// Draw ball
function drawBall(game) {
    const ball = game.ball;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Draw paddles
function drawPaddles(game) {
    const paddle1 = game.paddle1;
    const paddle2 = game.paddle2;

    paddle1.draw();
    paddle2.draw();
}

function resetBall(game) {
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
}

function updateScore(game) {
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    score1.textContent = game.score.player1;
    score2.textContent = game.score.player2;
}

function handlePaddleCollision(ball, paddle) {
    // Where the ball hit the paddle
    let collidePoint = ball.y - (paddle.y + paddle.height / 2);

    // Normalize the value between -1 and 1
    collidePoint = collidePoint / (paddle.height / 2);

    // To Rad
    let angleRad = collidePoint * (Math.PI / 4);
    ball.speedX = -ball.speedX;
    ball.speedY = ball.speedX * Math.tan(angleRad);
}

// Draw everything
function draw(game) {
    if (game.pause) {
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball and paddles
    drawBall(game);
    drawPaddles(game);

    // Ball movement
    game.ball.x += game.ball.speedX;
    game.ball.y += game.ball.speedY;

    // Paddle movement
    game.paddle1.update();
    game.paddle2.update();

    const { ball, paddle1, paddle2 } = game;
    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < paddle1.x + paddle1.width) &&
        (ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height)
    ) {
        handlePaddleCollision(ball, paddle1);
    } else if (
        (ball.x + ball.radius > paddle2.x) &&
        (ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height)
    ) {
        handlePaddleCollision(ball, paddle2);
    }

    // Game over if ball goes beyond paddles
    if (ball.x - ball.radius < 0) {
        game.score.player2++;
        resetBall(game);
        updateScore(game);
    } else if (ball.x + ball.radius > canvas.width) {
        game.score.player1++;
        resetBall(game);
        updateScore(game);
    }
}

function handleKeyDown(game) {
    document.addEventListener('keydown', (event) => {
        const key = event.key.length == 1 ?
            event.key.toLowerCase() : event.key
        switch (key) {
            case 'p':
            case ' ':
                game.pause = !game.pause;
                const pauseElement = document.getElementById('pause');
                if (game.pause)
                {
                    pauseElement.style.setProperty('display', 'block');
                } else {
                    pauseElement.style.setProperty('display', 'none');
                }
                break;
            case 'w':
                game.paddle1.move('up');
                break;
            case 's':
                game.paddle1.move('down');
                break;
            case 'ArrowUp':
                game.paddle2.move('up');
                break;
            case 'ArrowDown':
                game.paddle2.move('down');
                break;
            default:
                break ;
        }
    });
}

function handleKeyUp(game) {
    document.addEventListener('keyup', (event) => {
        const key = event.key.length == 1 ?
            event.key.toLowerCase() : event.key
        switch (key) {
            case 'w':
            case 's':
                game.paddle1.stop();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                game.paddle2.stop();
                break;
        }
    });
}

function handleKeyPress(game) {
    handleKeyDown(game);
    handleKeyUp(game);
}

function getWinner(game) {
    const score = game.score;
    if ((score.player1 == 7 || score.player2 == 7)
        && Math.abs(score.player1 - score.player2) == 7)
        return (score.player1 > score.player2 ? 1 : 2);
    if ((score.player1 >= 11 || score.player2 >= 11)
        && Math.abs(score.player1 - score.player2) >= 2)
        return (score.player1 > score.player2 ? 1 : 2);
    return (0);
}

async function playGame() {
    // Ball object
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speedX: 7,
        speedY: 7,
        color: "#fff"
    };
    const paddle1 = new Paddle(0, canvas.height / 2 - 60, 10, 120, "#fff");
    const paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 60, 10, 120, "#fff");

    const game = {
        ball,
        paddle1,
        paddle2,
        pause: false,
        score: {
            player1: 0,
            player2: 0
        }
    };
    handleKeyPress(game);
    await new Promise(resolve => {
        const intervalId = setInterval(() => {
            draw(game);
            const winner = getWinner(game);
            if (winner != 0) {
                alert(`Player ${winner} wins!`);
                clearInterval(intervalId);
                resolve();
            }
        }, 16 /* 1000 / 60*/ );
    });
    return getWinner(game);
}

playGame().then(winner => {
    console.log(`Player ${winner} wins!`);
});
