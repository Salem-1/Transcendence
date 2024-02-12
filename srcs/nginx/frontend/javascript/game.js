var game = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.8;
    canvas.height = (9 / 16) * canvas.width; //(9 / 16) * 80vw
    if (canvas.height > window.innerHeight * 0.8) {
        canvas.height = window.innerHeight * 0.8;
        canvas.width = (16 / 9) * canvas.height; //(16 / 9) * 80vh
    }

    let BALL_SPEED = getWidthPixels(.5);
    let BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
    let PADDLE_SPEED = getWidthPixels(1);
    let PADDLE_WIDTH = getWidthPixels(1);
    let PADDLE_HEIGHT = getHeightPixels(20);

    // px = percentage * canvas.width / 100
    // percentage = px * 100 / canvas.width
    function getWidthPixels(percentage) {
        return canvas.width * (percentage / 100);
    }

    function getHeightPixels(percentage) {
        return canvas.height * (percentage / 100);
    }

    function getWidthPercentage(px) {
        return (px * 100) / canvas.width;
    }

    function getHeightPercentage(px) {
        return (px * 100) / canvas.height;
    }

    class Paddle {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = 0;
            this.initialSpeed = PADDLE_SPEED;
        }

        stop() {
            this.speed = 0;
        }

        moveUp() {
            this.speed = -this.initialSpeed;
        }

        moveDown() {
            this.speed = this.initialSpeed;
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

    function drawBall(game) {
        const ball = game.ball;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddles(game) {
        const paddle1 = game.paddle1;
        const paddle2 = game.paddle2;

        paddle1.draw();
        paddle2.draw();
    }

    function resetBall(game) {
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.ball.speedX = BALL_SPEED;
        game.ball.speedY = BALL_SPEED;
    }

    function updateScore(game) {
        const score1 = document.getElementById('score1');
        const score2 = document.getElementById('score2');
        score1.textContent = game.score.player1;
        score2.textContent = game.score.player2;
    }

    function isColliding(ball, paddle) {
        const effectivePaddleHeight = paddle.height * 1.5; // Adjust the multiplier as needed

        // Check for collision between ball and paddle
        return (
            ball.x - ball.radius < paddle.x + paddle.width &&
            ball.x + ball.radius > paddle.x &&
            ball.y - ball.radius < paddle.y + effectivePaddleHeight &&
            ball.y + ball.radius > paddle.y
        );
    }

    function handlePaddleCollision(ball, paddle) {
        // Where the ball hit the paddle
        let collidePoint = ball.y - (paddle.y + (paddle.height * 1.5) / 2);

        // Normalize the value between -1 and 1
        collidePoint = collidePoint / (paddle.height / 2);

        // To Rad
        let angleRad = collidePoint * (Math.PI / 4);
        ball.speedX = -ball.speedX;
        ball.speedY = ball.speedX * Math.tan(angleRad);
    }

    function draw(game) {
        if (game.pause) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall(game);
        drawPaddles(game);


        const { ball, paddle1, paddle2 } = game;
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.speedY *= -1;
        }

        if (isColliding(ball, paddle1)) {
            handlePaddleCollision(ball, paddle1);
        } else if (isColliding(ball, paddle2)) {
            handlePaddleCollision(ball, paddle2);
        }

        if (ball.x - ball.radius < 0) {
            game.score.player2++;
            resetBall(game);
            updateScore(game);
        } else if (ball.x + ball.radius > canvas.width) {
            game.score.player1++;
            resetBall(game);
            updateScore(game);
        }

        game.ball.x += game.ball.speedX;
        game.ball.y += game.ball.speedY;

        game.paddle1.update();
        game.paddle2.update();
    }

    function handleKeyDown(game) {
        document.addEventListener('keydown', (event) => {
			if (window.location.pathname !== "/game")
				return;
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
                    game.paddle1.moveUp();
                    break;
                case 's':
                    game.paddle1.moveDown();
                    break;
                case 'ArrowUp':
                    game.paddle2.moveUp();
                    break;
                case 'ArrowDown':
                    game.paddle2.moveDown();
                    break;
                default:
                    break ;
            }
        });
    }

    function handleKeyUp(game) {
        document.addEventListener('keyup', (event) => {
			if (window.location.pathname !== "/game")
				return;
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

    function handleResize(game) {
        window.addEventListener('resize', () => {
			if (window.location.pathname !== "/game")
				return;
            game.pause = true;
            const pauseElement = document.getElementById('pause');
            pauseElement.style.setProperty('display', 'block');
            const oldP1Posistion = { x: getWidthPercentage(game.paddle1.x), y: getHeightPercentage(game.paddle1.y) };
            const oldP2Posistion = { x: getWidthPercentage(game.paddle2.x), y: getHeightPercentage(game.paddle2.y) };
            const oldBallPosistion = { x: getWidthPercentage(game.ball.x), y: getHeightPercentage(game.ball.y) };
            canvas.width = window.innerWidth * 0.8;
            canvas.height = (9 / 16) * canvas.width;
            if (canvas.height > window.innerHeight * 0.8) {
                canvas.height = window.innerHeight * 0.8;
                canvas.width = (16 / 9) * canvas.height; //(16 / 9) * 80vh
            }
            BALL_SPEED = getWidthPixels(0.5);
            BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
            PADDLE_SPEED = getWidthPixels(0.7);
            PADDLE_WIDTH = getWidthPixels(1);
            PADDLE_HEIGHT = getHeightPixels(20);
            game.paddle1 = new Paddle(getWidthPixels(oldP1Posistion.x), getHeightPixels(oldP1Posistion.y), PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
            game.paddle2 = new Paddle(getWidthPixels(oldP2Posistion.x), getHeightPixels(oldP2Posistion.y), PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
            game.ball = {
                x: getWidthPixels(oldBallPosistion.x),
                y: getHeightPixels(oldBallPosistion.y),
                radius: BALL_RADIUS,
                speedX: BALL_SPEED,
                speedY: BALL_SPEED,
                color: "#fff"
            };
        });
    }

    function getWinner(game) {
        const score = game.score;
        if ((score.player1 == 1 || score.player2 == 1)
            && Math.abs(score.player1 - score.player2) == 1)
            return (score.player1 > score.player2 ? 1 : 2);
        if ((score.player1 >= 11 || score.player2 >= 11)
            && Math.abs(score.player1 - score.player2) >= 2)
            return (score.player1 > score.player2 ? 1 : 2);
        return (0);
    }

    async function playGame() {
        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: BALL_RADIUS,
            speedX: BALL_SPEED,
            speedY: BALL_SPEED,
            color: "#fff"
        };
        const paddle1 = new Paddle(0, canvas.height / 2 - 60, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
        const paddle2 = new Paddle(canvas.width - PADDLE_WIDTH, canvas.height / 2 - 60, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

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
        handleResize(game);
        return await new Promise(resolve => {
            const intervalId = setInterval(() => {
				const location = window.location.pathname; // get the url path
				if (location !== '/game')
				{
					clearInterval(intervalId);
					return (-1);
				}
                draw(game);
                const winner = getWinner(game);
                if (winner != 0) {
                    alert(`${winner === 1 ? 'Left' : 'Right'} side won!`);
                    clearInterval(intervalId);
                    resolve(winner);
					
                }
            }, 16 /* 1000 / 60*/ );
        });
    }

    function readQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const isTournament = Boolean(urlParams.get('tournament'));
        const player1 = urlParams.get('player1');
        const player2 = urlParams.get('player2');
        return { isTournament, player1, player2 };
    }

    async function main() {
        const { isTournament, player1, player2 } = readQueryParams();
        if (!isTournament) {
            await playGame();
            callRoute('/home');
        } else {
            if (player1)
                document.getElementById('player1').innerText = player1;
            if (player2)
                document.getElementById('player2').innerText = player2;
            const winner = await playGame();
			if (winner === -1)
				return ;
			const round = JSON.parse(localStorage.getItem('round'));
			const level = JSON.parse(localStorage.getItem('level'));
			const roundWinners = JSON.parse(localStorage.getItem('roundWinners')) || {};

			if (level == 1) {
				roundWinners['0'] = winner ? player1 : player2;
			} else if (level == 2) {
				if (player1 == round['0'][0] && player2 == round['0'][1]) {
					roundWinners['0'] = winner ? player1 : player2;
				} else {
					roundWinners['1'] = winner ? player1 : player2;
				}
			} else if (level == 3) {
				if (player1 == round['0'][0] && player2 == round['0'][1]) {
					roundWinners['0'] = winner ? player1 : player2;
				} else if (player1 == round['1'][0] && player2 == round['1'][1]) {
					roundWinners['1'] = winner ? player1 : player2;
				} else if (player1 == round['2'][0] && player2 == round['2'][1]) {
					roundWinners['2'] = winner ? player1 : player2;
				} else {
					roundWinners['3'] = winner ? player1 : player2;
				}
			}
			localStorage.setItem('roundWinners', JSON.stringify(roundWinners));
            callRoute('/tournament');
        }
    }

    main();
};

game();
