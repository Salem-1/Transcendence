var game = async () => {
	if (window.location.pathname !== "/game") return;
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth * 0.8;
	canvas.height = (9 / 16) * canvas.width; //(9 / 16) * 80vw
	if (canvas.height > window.innerHeight * 0.8) {
		canvas.height = window.innerHeight * 0.8;
		canvas.width = (16 / 9) * canvas.height; //(16 / 9) * 80vh
	}

	let BALL_SPEED = getWidthPixels(1);
	let BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
	let PADDLE_SPEED = getWidthPixels(0.5);
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
	
		const minSlope = Math.tan(Math.PI / 6); // 30 degrees
		const maxSlope = Math.tan((5 * Math.PI) / 6); // 150 degrees
	
		// Generate a random slope within the defined range
		const slope = Math.random() * (maxSlope - minSlope) + minSlope;
		const directionX = Math.random() < 0.5 ? -1 : 1;
		const directionY = Math.random() < 0.5 ? -1 : 1;

		// Calculate the initial velocity components based on the slope and directions
		game.ball.speedX = directionX * BALL_SPEED / Math.sqrt(1 + slope * slope);
		game.ball.speedY = directionY * BALL_SPEED * Math.abs(slope) / Math.sqrt(1 + slope * slope);
		if (directionX < 0){
			game.ball.x = canvas.width / 1.2;
			game.ball.y = canvas.height / 2;
		}
		else{
			game.ball.x = canvas.width / 4;
			game.ball.y = canvas.height / 2;

		}
	}
	

	function updateScore(game) {
		const score1 = document.getElementById("score1");
		const score2 = document.getElementById("score2");
		score1.textContent = game.score.player1;
		score2.textContent = game.score.player2;
	}

	function isColliding(ball, paddle) {
		const newPaddleY = paddle.y - 0.10 * paddle.height;
		const newPaddleHeight = 1.20 * paddle.height;
		// ctx.fillStyle = "rgba(255,0,0,0.3)";
		// ctx.fillRect(paddle.x, newPaddleY, paddle.width, newPaddleHeight);
		return (
			ball.x - ball.radius + ball.speedX < paddle.x + paddle.width &&
			ball.x + ball.radius + ball.speedX > paddle.x &&
			ball.y - ball.radius < newPaddleY + newPaddleHeight &&
			ball.y + ball.radius > newPaddleY
		);
	}

	function handlePaddleCollision(ball, paddle) {
		const newPaddleY = paddle.y - 0.10 * paddle.height;
		const newPaddleHeight = 1.20 * paddle.height;
		let collidePoint = ball.y - (newPaddleY+ (newPaddleHeight) / 2);
		// Normalize
		collidePoint = collidePoint / (newPaddleHeight / 2);
		if (collidePoint > 1) collidePoint = 1;
		if (collidePoint < -1) collidePoint = -1;

		const angleRad = collidePoint * (Math.PI / 4);
		ball.speedX = -ball.speedX; // Reverse horizontal direction
	
		// Calculate new vertical speed based on collision angle
		ball.speedY = BALL_SPEED * Math.sin(angleRad);
	}

	function draw(game) {
		if (game.pause) {
			return;
		}
		const { ball, paddle1, paddle2 } = game;

		if (isColliding(ball, paddle1)) {
			handlePaddleCollision(ball, paddle1);
		} else if (isColliding(ball, paddle2)) {
			handlePaddleCollision(ball, paddle2);
		}
		game.ball.x += game.ball.speedX;
		game.ball.y += game.ball.speedY;
		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
			ball.speedY *= -1;
		}
		game.paddle1.update();
		game.paddle2.update();
		if (ball.x - ball.radius < 0) {
			game.score.player2++;
			resetBall(game);
			updateScore(game);
		} else if (ball.x + ball.radius > canvas.width) {
			game.score.player1++;
			resetBall(game);
			updateScore(game);
		}
		if (getWinner(game) != 0)
			return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall(game);
		drawPaddles(game);
	}

	function handleKeyDown(game, event) {
		if (window.location.pathname !== "/game") return;
		const key =
			event.key.length == 1 ? event.key.toLowerCase() : event.key;
		switch (key) {
			case "p":
			case " ":
				game.pause = !game.pause;
				const pauseElement = document.getElementById("pause");
				if (game.pause) {
					pauseElement.style.setProperty("display", "block");
				} else {
					pauseElement.style.setProperty("display", "none");
				}
				break;
			case "w":
				game.paddle1.moveUp();
				break;
			case "s":
				game.paddle1.moveDown();
				break;
			case "ArrowUp":
				game.paddle2.moveUp();
				break;
			case "ArrowDown":
				game.paddle2.moveDown();
				break;
			default:
				break;
		}
	}

	function handleKeyUp(game, event) {
		if (window.location.pathname !== "/game") return;
		const key =
			event.key.length == 1 ? event.key.toLowerCase() : event.key;
		switch (key) {
			case "w":
			case "s":
				game.paddle1.stop();
				break;
			case "ArrowUp":
			case "ArrowDown":
				game.paddle2.stop();
				break;
		}
	}

	function handleResize(game) {
		if (window.location.pathname !== "/game") return;
		game.pause = true;
		const pauseElement = document.getElementById("pause");
		pauseElement.style.setProperty("display", "block");
		const oldP1Posistion = {
			x: getWidthPercentage(game.paddle1.x),
			y: getHeightPercentage(game.paddle1.y),
		};
		const oldP2Posistion = {
			x: getWidthPercentage(game.paddle2.x),
			y: getHeightPercentage(game.paddle2.y),
		};
		const oldBallPosistion = {
			x: getWidthPercentage(game.ball.x),
			y: getHeightPercentage(game.ball.y),
		};
		canvas.width = window.innerWidth * 0.8;
		canvas.height = (9 / 16) * canvas.width;
		if (canvas.height > window.innerHeight * 0.8) {
			canvas.height = window.innerHeight * 0.8;
			canvas.width = (16 / 9) * canvas.height; //(16 / 9) * 80vh
		}
		BALL_SPEED = getWidthPixels(1);
		BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
		PADDLE_SPEED = getWidthPixels(0.5);
		PADDLE_WIDTH = getWidthPixels(1);
		PADDLE_HEIGHT = getHeightPixels(20);
		game.paddle1 = new Paddle(
			getWidthPixels(oldP1Posistion.x),
			getHeightPixels(oldP1Posistion.y),
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		game.paddle2 = new Paddle(
			getWidthPixels(oldP2Posistion.x),
			getHeightPixels(oldP2Posistion.y),
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		game.ball = {
			x: getWidthPixels(oldBallPosistion.x),
			y: getHeightPixels(oldBallPosistion.y),
			radius: BALL_RADIUS,
			speedX: BALL_SPEED,
			speedY: BALL_SPEED,
			color: "#fff",
		};
	}

	function getWinner(game) {
		const score = game.score;
		if (
			(score.player1 >= 5 || score.player2 >= 5) &&
			Math.abs(score.player1 - score.player2) >= 2
		)
			return score.player1 > score.player2 ? 1 : 2;
		return 0;
	}

	async function countDown(game) {
		game.pause = !game.pause;
		const pauseText = await getTranslation("game paused");
		const pauseElement = document.getElementById("pause");
		pauseElement.style.setProperty("display", "block");			
		let i = 4
		while (i > 0) {
			pauseElement.textContent = `GO 😎`;
			await new Promise((resolve) => setTimeout(resolve, 50));
			i--;
		}
		game.pause = !game.pause;
		pauseElement.style.setProperty("display", "none");
		pauseElement.textContent = pauseText;
	}

	async function gameLoop(game)
	{
		if (window.location.pathname !== "/game" || !game.running) 
			return;
		draw(game);
		if (game.pause == false)
		{
			game.ball.speedX += game.ball.speedX  * 0.001;
			game.ball.speedY += game.ball.speedY * 0.001;
		}
		const winner = getWinner(game);
		if (winner != 0) {
			timedAlert(`${winner === 1 ? await getTranslation("left wins") : await getTranslation("right wins")}`, "success", 3000);
			return;
		}
		requestAnimationFrame(gameLoop.bind(null, game));
	}

	async function playGame() {
		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: BALL_RADIUS,
			speedX: BALL_SPEED,
			speedY: 0,
			color: "#fff",
		};
		const paddle1 = new Paddle(
			0,
			canvas.height / 2 - PADDLE_HEIGHT / 2,
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		const paddle2 = new Paddle(
			canvas.width - PADDLE_WIDTH,
			canvas.height / 2 - PADDLE_HEIGHT / 2,
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);

        const game = {
            ball,
            paddle1,
            paddle2,
            pause: false,
			running: true,
            score: {
                player1: 0,
                player2: 0
            }
        };
		resetBall(game);
		draw(game);
		await countDown(game);
		window.addEventListener("resize", handleResize.bind(null, game));
		window.addEventListener("keydown", handleKeyDown.bind(null, game));
		window.addEventListener("keyup", handleKeyUp.bind(null, game));
		window.addEventListener("popstate", () => {
			game.running = false;
			window.removeEventListener("resize", handleResize.bind(null, game));
			window.removeEventListener("keydown", handleKeyDown.bind(null, game));
			window.removeEventListener("keyup", handleKeyUp.bind(null, game));
			return
		});
		requestAnimationFrame(gameLoop.bind(null, game));
		while (getWinner(game) == 0) {
			await new Promise(resolve => setTimeout(resolve, 200));
		}
		// return new Promise(resolve => requestAnimationFrame(gameLoop.bind(null, game)));
		window.removeEventListener("resize", handleResize.bind(null, game));
		window.removeEventListener("keydown", handleKeyDown.bind(null, game));
		window.removeEventListener("keyup", handleKeyUp.bind(null, game));
    }

	function readQueryParams() {
		const urlParams = new URLSearchParams(window.location.search);
		const isTournament = Boolean(urlParams.get("tournament"));
		const player1 = urlParams.get("player1");
		const player2 = urlParams.get("player2");
		return { isTournament, player1, player2 };
	}

	async function main() {
		const { isTournament, player1, player2 } = readQueryParams();
		if (!isTournament) {
			await playGame();
			callRoute("/home");
		} else {
			if (player1 && player2) {
				document.getElementById("player1").removeAttribute('data-i18n');
				document.getElementById("player2").removeAttribute('data-i18n');
				document.getElementById("player1").innerText = player1;
				document.getElementById("player2").innerText = player2;
			}
			const winner = await playGame();
			if (winner === -1) return;
			if ( localStorage.getItem("players").includes(player1) == false || localStorage.getItem("players").includes(player2) == false)
			{
				timedAlert( await getTranslation("invalid player name"), "danger");
				callRoute("/home");
				return;
			}
			const round = JSON.parse(localStorage.getItem("round"));
			const level = JSON.parse(localStorage.getItem("level"));
			const roundWinners =
				JSON.parse(localStorage.getItem("roundWinners")) || {};

			if (level == 1) {
				roundWinners["0"] = winner === 1 ? player1 : player2;
			} else if (level == 2) {
				if (player1 == round["0"][0] && player2 == round["0"][1]) {
					roundWinners["0"] = winner === 1 ? player1 : player2;
				} else {
					roundWinners["1"] = winner === 1 ? player1 : player2;
				}
			} else if (level == 3) {
				if (player1 == round["0"][0] && player2 == round["0"][1]) {
					roundWinners["0"] = winner === 1 ? player1 : player2;
				} else if (
					player1 == round["1"][0] &&
					player2 == round["1"][1]
				) {
					roundWinners["1"] = winner === 1 ? player1 : player2;
				} else if (
					player1 == round["2"][0] &&
					player2 == round["2"][1]
				) {
					roundWinners["2"] = winner === 1 ? player1 : player2;
				} else {
					roundWinners["3"] = winner === 1 ? player1 : player2;
				}
			}
			localStorage.setItem("roundWinners", JSON.stringify(roundWinners));
			try {
				if (level === 1)
					callRoute('/tournament');
				else
					initTournament();
			} catch (e) {
			  timedAlert(e);
			  callRoute("/home");
			}
		}
	}

	await main();
};

game();
