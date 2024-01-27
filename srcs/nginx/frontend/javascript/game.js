const PADDLE_SPEED = 50;
const BALL_SPEED = 50;
const PADDLE_HEIGHT = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--paddle-height"));
const PADDLE_WIDTH = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--paddle-width"));
const BALL_WIDTH = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--ball-width"));
const BALL_HEIGHT = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--ball-height"));

class Paddle {
    constructor(element) {
        this.element = element;
        this.direction = {x: 0, y: 0};
        const x = parseFloat(getComputedStyle(element).getPropertyValue('left'));
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        this.position = {x: (x / vw) * 100 , y: 0};
		this.score = 0;
        this.reset();
    }

    reset() {
        this.position.y = 40;
    }

    moveUp() {
        this.direction.y = -1;
    }

    moveDown() {
        this.direction.y = 1;
    }

    stop() {
        this.direction.y = 0;
    }

    update(dt) {
        const dy = this.direction.y * PADDLE_SPEED * dt;
        if (this.position.y + dy < 0) {
            this.position.y = 1;
        } else if (this.position.y + dy > 100 - PADDLE_HEIGHT) {
            this.position.y = 99 - PADDLE_HEIGHT;
        } else {
            this.position.y += dy;
        }
        this.position.y += dy;
        this.element.style.setProperty('top', `${this.position.y}vh`);
    }
}

class Ball {
    constructor(element) {
        this.element = element;
        this.direction = {x: 0, y: 0};
        this.position = {x: 0, y: 0};
        this.reset();
    }

    reset() {
        this.position.x = 50;
        this.position.y = 50;
        this.direction = {x: 0, y: 0};
        while (Math.abs(this.direction.x) < 0.25 || Math.abs(this.direction.x) > 0.95) {
            this.direction.x = Math.random() * Math.sign(Math.random() - 0.5);
        }
        while (Math.abs(this.direction.y) < 0.25 || Math.abs(this.direction.y) > 0.95) {
            this.direction.y = Math.random() * Math.sign(Math.random() - 0.5);
        }
    }

    stop() {
        this.direction.y = 0;
    }

    isColliding(paddle) {
        const ballLeft = this.position.x;
        const ballRight = this.position.x + BALL_WIDTH;
        const ballTop = this.position.y;
        const ballBottom = this.position.y + BALL_HEIGHT;

        const paddleLeft = paddle.position.x;
        const paddleRight = paddle.position.x + PADDLE_WIDTH;
        const paddleTop = paddle.position.y;
        const paddleBottom = paddle.position.y + PADDLE_HEIGHT;

        return (ballLeft < paddleRight && ballRight > paddleLeft
            && ballTop < paddleBottom && ballBottom > paddleTop);
    }

    update(dt, p1, p2) {
        if (this.isColliding(p1)) {
			this.direction.x *= -1;
            if (this.position.y > p1.position.y + (0.5 * PADDLE_HEIGHT))
			{
				this.direction.y = 1;
			} else {
				this.direction.y = -1;
			}
        } else if (this.isColliding(p2)) {
			this.direction.x *= -1;
            if (this.position.y > p2.position.y + (0.5 * PADDLE_HEIGHT))
			{
				this.direction.y = 1;
			} else {
				this.direction.y = -1;
			}
        }
        const dx = this.direction.x * BALL_SPEED * dt;
        const dy = this.direction.y * BALL_SPEED * dt;
        
        if (this.position.y + dy <= 0 || this.position.y + BALL_HEIGHT + dy >= 100) {
            this.direction.y *= -1;
        }
        if (this.position.x + dx < 0) {
            p2.score++;
			const score2 = document.getElementById('score2');
			score2.innerHTML = p2.score;
            this.reset();
        }
        if (this.position.x + BALL_WIDTH + dx > 100) {
            p1.score++;
			const score1 = document.getElementById('score1');
			score1.innerHTML = p1.score;
            this.reset();
        }

        this.position.x += dx;
        this.position.y += dy;
        this.element.style.setProperty('left', `${this.position.x}vw`);
        this.element.style.setProperty('top', `${this.position.y}vh`);
    }
}

function handleKeyDown(game) {
    const {p1, p2} = game;
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
                    pauseElement.style.setProperty('visibility', 'visible');
                } else {
                    pauseElement.style.setProperty('visibility', 'hidden');
                }
                break;
            case 'w':
                p1.moveUp();
                break;
            case 's':
                p1.moveDown();
                break;
            case 'ArrowUp':
                p2.moveUp();
                break;
            case 'ArrowDown':
                p2.moveDown();
                break;
            default:
                break ;
        }
    });
}

function handleKeyUp(game) {
    const {p1, p2} = game;
    document.addEventListener('keyup', (event) => {
        const key = event.key.length == 1 ?
            event.key.toLowerCase() : event.key
        switch (key) {
            case 'w':
            case 's':
                p1.stop();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                p2.stop();
                break;
        }
    });
}

function handleKeyPress(game) {
    handleKeyDown(game);
    handleKeyUp(game);
}

function getWinner(game) {
    const {p1, p2} = game;
    if ((p1.score == 7 || p2.score == 7) && Math.abs(p1.score - p2.score) == 7)
        return (p1.score > p2.score ? 1 : 2);
    if ((p1.score >= 11 || p2.score >= 11) && Math.abs(p1.score - p2.score) >= 2)
        return (p1.score > p2.score ? 1 : 2);
    return (0);
}

async function playGame() {
    const p1 = new Paddle(document.getElementById('p1'));
    const p2 = new Paddle(document.getElementById('p2'));
    const ball = new Ball(document.getElementById('ball'));
    const game = { p1, p2, ball, pause: false };

    handleKeyPress(game);
    await new Promise(resolve => {
        let lastTimestamp = Date.now();
        const intervalId = setInterval(() => {
            if (getWinner(game) !== 0) {
                clearInterval(intervalId);
                resolve(getWinner(game));
            }

            const timestamp = Date.now();
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            if (!game.pause) {
                p1.update(deltaTime);
                p2.update(deltaTime);
                ball.update(deltaTime, p1, p2);
            }
        }, 16.666);
    });
    return (getWinner(game));
}

function searchToObject() {
    const pairs = window.location.search.substring(1).split("&");
    const obj = {};

    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        obj[pair[0]] = pair.length > 1 ?  pair[1] : '';
    }
    return (obj);
}

/**
 * 
 * eg.: {player1: "player1Name", player2: "player2Name"}
 * for 1v1 it will just be a 2 player object
 * for player vs AI it will be a 1 player object
 * players will be taken from window.location.search
 * if no players are found, it will be a 1 v 1 game
 */
async function playTournament() {
    const players = searchToObject();
    if (Object.keys(players).length <= 1) {
        return (await playGame());
    }
    return (-1);
}

playTournament().then(winner => {
    console.log(winner);
});
