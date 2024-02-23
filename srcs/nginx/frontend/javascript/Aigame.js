var AIgame = async () => {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth * 0.8;
	canvas.height = (9 / 16) * canvas.width; //(9 / 16) * 80vw
	if (canvas.height > window.innerHeight * 0.8) {
		canvas.height = window.innerHeight * 0.8;
		canvas.width = (16 / 9) * canvas.height; //(16 / 9) * 80vh
	}

	let BALL_SPEED = getWidthPixels(1.1);
	let BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
	let PADDLE_SPEED = getWidthPixels(0.5);
	let PADDLE_WIDTH = getWidthPixels(1);
	let PADDLE_HEIGHT = getHeightPixels(20);

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
		return Math.ceil((px * 100) / canvas.height);
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
		const p1 = game.p1;
		const p2 = game.p2;

		p1.draw();
		p2.draw();
	}

	function resetBall(game) {
		
		const minSlope = Math.tan(Math.PI / 6); // 30 degrees
		const maxSlope = Math.tan((5 * Math.PI) / 6); // 150 degrees
		
		// Generate a random slope within the defined range
		const slope = Math.random() * (maxSlope - minSlope) + minSlope;
		const directionX = Math.random() < 0.5 ? -1 : 1;
		const directionY = Math.random() < 0.5 ? -1 : 1;
		
		// Calculate the initial velocity components based on the slope and directions
		game.ball.speedX = (directionX * BALL_SPEED) / Math.sqrt(1 + slope * slope);
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
			ball.x - ball.radius < paddle.x + paddle.width &&
			ball.x + ball.radius > paddle.x &&
			ball.y - ball.radius < newPaddleY + newPaddleHeight &&
			ball.y + ball.radius > newPaddleY
		);
	}

	function handlePaddleCollision(ball, paddle) {
		const newPaddleY = paddle.y - 0.10 * paddle.height;
		const newPaddleHeight = 1.20 * paddle.height;
		let collidePoint = ball.y - (newPaddleY + (newPaddleHeight) / 2);
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
		const { ball, p1: paddle1, p2: paddle2 } = game;

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
		paddle1.update();
		paddle2.update();
		if (ball.x - ball.radius < 0) {
			game.score.player2++;
			resetBall(game);
			updateScore(game);
		} else if (ball.x + ball.radius > canvas.width) {
			game.score.player1++;
			resetBall(game);
			updateScore(game);
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall(game);
		drawPaddles(game);
	}

	function handleKeyDown(game, event) {
		if (window.location.pathname !== "/AIgame") return;
		if (event.key === "p" || event.key === " ")
		{
			game.pause = !game.pause;
			const pauseElement = document.getElementById("pause");
			if (game.pause) {
				pauseElement.style.setProperty("display", "block");
			} else {
				pauseElement.style.setProperty("display", "none");
			}
		} else if (event.key === "w") {
			game.p1.moveUp();
		} else if (event.key === "s") {
			game.p1.moveDown();
		} else if (event.key === "ArrowUp") {
			game.p2.moveUp();
		} else if (event.key === "ArrowDown") {
			game.p2.moveDown();
		}
	}

	function handleKeyUp(game, event) {
		if (window.location.pathname !== "/AIgame") return;
		if (event.key === "w" || event.key === "s") game.p1.stop();
		if (event.key === "ArrowUp" || event.key === "ArrowDown") game.p2.stop();

		// console.log(event.key);
		// const key = event.key;
		// switch (key) {
		// 	case "w":
		// 	case "s":
		// 		game.p1.stop();
		// 		break;
		// 	case "ArrowUp":
		// 	case "ArrowDown":
		// 		game.p2.stop();
		// 		break;
		// }
	}

	function handleKeyPress(game) {
		handleKeyDown(game);
		handleKeyUp(game);
	}

	function handleResize(game, event) {
		if (window.location.pathname !== "/AIgame") return;
		game.pause = true;
		const pauseElement = document.getElementById("pause");
		pauseElement.style.setProperty("display", "block");
		const oldP1Posistion = {
			x: getWidthPercentage(game.p1.x),
			y: getHeightPercentage(game.p1.y),
		};
		const oldP2Posistion = {
			x: getWidthPercentage(game.p2.x),
			y: getHeightPercentage(game.p2.y),
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
		BALL_SPEED = getWidthPixels(1.1);
		BALL_RADIUS = Math.min(getWidthPixels(2), getHeightPixels(2));
		PADDLE_SPEED = getWidthPixels(0.5);
		PADDLE_WIDTH = getWidthPixels(1);
		PADDLE_HEIGHT = getHeightPixels(20);
		game.p1 = new Paddle(
			getWidthPixels(oldP1Posistion.x),
			getHeightPixels(oldP1Posistion.y),
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		game.p2 = new Paddle(
			getWidthPixels(oldP2Posistion.x),
			getHeightPixels(oldP2Posistion.y),
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		
		game.ball.x = getWidthPixels(oldBallPosistion.x);
		game.ball.y = getHeightPixels(oldBallPosistion.y);
		game.ball.radius = BALL_RADIUS;
		game.ball.speedX = BALL_SPEED;
		game.ball.speedY = BALL_SPEED;
		game.ball.color = "#fff";	
	}

	function getWinner(game) {
		const score = game.score;
		if (
			(score.player1 == 7 || score.player2 == 7) &&
			Math.abs(score.player1 - score.player2) == 7
		)
			return score.player1 > score.player2 ? 1 : 2;
		if (
			(score.player1 >= 11 || score.player2 >= 11) &&
			Math.abs(score.player1 - score.player2) >= 2
		)
			return score.player1 > score.player2 ? 1 : 2;
		return 0;
	}

	async function playGame() {
		if (window.location.pathname !== "/AIgame") return;
		const ball = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			radius: BALL_RADIUS,
			speedX: BALL_SPEED,
			speedY: 0,
			color: "#fff",
		};
		const p1 = new Paddle(
			0,
			canvas.height / 2 - PADDLE_HEIGHT / 2,
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		const p2 = new Paddle(
			canvas.width - PADDLE_WIDTH,
			canvas.height / 2 - PADDLE_HEIGHT / 2,
			PADDLE_WIDTH,
			PADDLE_HEIGHT,
			"#fff"
		);
		const game = {
			ball,
			p1,
			p2,
			pause: false,
			score: {
				player1: 0,
				player2: 0,
			},
		};
		let gameObjects = {};
		initGameObjects(gameObjects, game);
		let lastTimestamp = 0;
		let moves = {};
		let timestamp = Date.now();
		window.addEventListener("resize", handleResize.bind(null, game));
		window.addEventListener("keydown", handleKeyDown.bind(null, game));
		window.addEventListener("keyup", handleKeyUp.bind(null, game));
		return await new Promise((resolve) => {
			const intervalId = setInterval(async () => {
				if (window.location.pathname !== "/AIgame") {
					clearInterval(intervalId);
					window.removeEventListener("resize", handleResize.bind(null, game));
					window.removeEventListener("keydown", handleKeyDown.bind(null, game));
					window.removeEventListener("keyup", handleKeyUp.bind(null, game));
					return;
				}
				draw(game);
				gameObjects["ball"] = game.ball;
				timestamp = Date.now();
				const deltaTime = (timestamp - lastTimestamp) / 1000;
				gameObjects["deltaTime"] = deltaTime;
				gameObjects["currentMinute"] = Math.floor(timestamp / 1000);
				if (gameObjects["currentMinute"] > gameObjects["lastMinute"]) {
					try {
						moves = decideNextMoves(gameObjects, moves, game);
					} catch (e) {
						moves = { up: 1 };
					}
					gameObjects["ballLastPosition"] = { x: ball.x, y: ball.y };
				}
				AiBlindMove(game.p1, moves);
				// AiTrainer(game);
				lastTimestamp = timestamp;
				const winner = getWinner(game);
				if (winner != 0) {
					timedAlert(
						` ${await getTranslation(
							"player"
						)} ${winner} ${await getTranslation("wins")}`,
						"success"
					);
					// clearInterval(intervalId);
					// resolve(winner);
					window.removeEventListener("resize", handleResize.bind(null, game));
					window.removeEventListener("keydown", handleKeyDown.bind(null, game));
					window.removeEventListener("keyup", handleKeyUp.bind(null, game));
					callRoute("/home");
					return;
				}
			}, 16 /* 1000 / 60*/);
		});
	}

	playGame().then((winner) => {
		// fix this
	;
	});

	function initGameObjects(gameObjects, game) {
		gameObjects["p1"] = game.p1;
		gameObjects["p2"] = game.p2;
		gameObjects["ball"] = game.ball;
		gameObjects["lastMinute"] = 0;
		gameObjects["currentMinute"] = 0;
		gameObjects["ballLastPosition"] = { x: game.ball.x, y: game.ball.y };
		gameObjects["hitPoints"] = [];
	}

	//--------------------------AI Alogrith------------------------------------//
	// let gameObjects = {};
	// let lastTimestamp = 0;
	// gameObjects["p1"] = p1;
	// gameObjects["p2"] = p2;
	// gameObjects["ball"] = ball;
	// gameObjects["lastMinute"] = 0;
	// gameObjects["currentMinute"] = 0;
	// gameObjects["ballLastPosition"] = ball_position
	// const CENTER = 40;
	// let moves = {};
	// let hitPoints = [];

	// function gameLoop(timestamp) {
	// const deltaTime = (timestamp - lastTimestamp) / 1000;
	// gameObjects["deltaTime"] = deltaTime;
	// gameObjects["currentMinute"] = Math.floor(timestamp / 1000);
	// if (!pause)
	// {
	//     updatePositions(gameObjects);
	//     if (gameObjects["currentMinute"] > gameObjects["lastMinute"]){
	//         try{
	//             moves = decideNextMoves(gameObjects);
	//         }
	//         catch {
	//             moves = {up:1};
	//         }
	//         gameObjects["ballLastPosition"] = {...ball_position}
	//     }
	//     // AiTrainer(gameObjects["p2"], gameObjects["ball"]);
	//     AiBlindMove(moves);
	// }
	// lastTimestamp = timestamp;
	//     window.requestAnimationFrame(gameLoop);
	// }

	function decideNextMoves(gameObjects, moves, game) {
	
		if (AiHaveJustHitBall(gameObjects, game)) {
			gameObjects["hitPoints"] = [];
			moves = recoverToCenter(gameObjects, game);
		}
		else if (
			isAiTurn(gameObjects["ballLastPosition"].x, game.ball.x) &&
			ballIsHeadingTowardHuman(game)
			) {
			gameObjects["hitPoints"] = [];
			moves = counterHumanPaddel(moves, game);
		}
		else
			moves = AiPlay(gameObjects, game, moves);
		return moves;
	}

	function counterHumanPaddel(moves, game) {
		let counter_margin = 10;
		const CENTER = getHeightPixels(50);
		if (game.p2.y > CENTER && game.p1.y > CENTER) {
			moves = {
				up: countHeightSteps(
					game.p1.y - CENTER + game.p2.y - CENTER + counter_margin
				),
				down: 0,
			};
		} else if (game.p2.y < CENTER && game.p1.y < CENTER) {
			moves = {
				down: countHeightSteps(CENTER - game.p1.y + CENTER - game.p2.y),
				up: 0,
			};
		} 
		else 
			moves = { stop: 0, up: 0, down: 0 };
		return moves;
	}

	function recoverToCenter(gameObjects, game) {
		let center_margin = -1 * getHeightPixels(20);
		const CENTER = getHeightPixels(50);
		if (game.p1.y > CENTER - center_margin) {
			moves = {
				up: countHeightSteps(game.p1.y - CENTER - center_margin),
				down: 0,
			};
		} else if (game.p1.y < CENTER + center_margin) {
			moves = { down: countHeightSteps(CENTER - game.p1.y), up: 0 };
		} else moves = { stop: 0, up: 0, down: 0 };
		gameObjects["lastMinute"] = gameObjects["currentMinute"];
		return moves;
	}

	function countHeightSteps(pixels) {
		return Math.ceil(getHeightPercentage(pixels));
	}

	function AiPlay(gameObjects, game, moves) {
		let move_margin = 10;
		let nominated_hitpoint = getHitPoint(gameObjects, game);
		if (isNaN(nominated_hitpoint) || nominated_hitpoint < 0 
				|| nominated_hitpoint > getHeightPixels(100)){
					return ;
				}
		gameObjects["hitPoints"].push(nominated_hitpoint);
		let chosenHitPoint = getChosenPoint(gameObjects["hitPoints"]);
		if (game.p1.y > chosenHitPoint) {
			moves = {
				up: countHeightSteps(game.p1.y - chosenHitPoint),
				down: 0,
			};
		} else if (game.p1.y < chosenHitPoint) {
			moves = {
				down: countHeightSteps(chosenHitPoint - game.p1.y),
				up: 0,
			};
		} else
			moves = { stop: 0, up: 0, down: 0 };
		gameObjects["lastMinute"] = gameObjects["currentMinute"];
		return moves;
	}

	function showHitPoints(hitpoints, chosenHitPoint) {
		let normalized_points = [];
		for (point in hitpoints) {
			normalized_points.push(getHeightPercentage(point));
		}
	}
	function getHitPoint(gameObjects, game) {
		let pos1 = {
			x: gameObjects["ballLastPosition"].x,
			y: gameObjects["ballLastPosition"].y,
		};
		let pos2 = { x: game.ball.x, y: game.ball.y };
		let slope = (pos2.y - pos1.y) / (pos2.x - pos1.x);
		let hit = Math.floor(pos2.y - slope * pos2.x);
		hit = getFinalHit(pos1, pos2, slope, hit, 7);

		return hit;
	}

	function getChosenPoint(hitPoints) {
		let occurances = [];
		for (let point in hitPoints) {
			let prop = 0;
			for (let i in hitPoints) {
				if (
					hitPoints[point] + 10 >= hitPoints[i] &&
					hitPoints[point] - 10 <= hitPoints[i]
				)
					prop++;
			}
			occurances.push(prop);
		}
		return hitPoints[occurances.indexOf(Math.max(...occurances))];
	}

	function getFinalHit(pos1, pos2, slope, hit, max_hit) {
		if (max_hit < 1){
			return (hit);
		}
		max_hit -= 1;
		if (hit > 0 && hit < canvas.height - 1) return hit;
		if (hit < 0) {
			let new_pos1 = { ...pos2 };
			let new_po2 = { x: -1 * (new_pos1.y / slope) + new_pos1.x, y: 0 };
			let new_slope = -1 * slope;
			let new_hit = Math.floor(new_po2.y - new_slope * new_po2.x);

			return getFinalHit(new_pos1, new_po2, new_slope, new_hit, max_hit);
		} else if (hit > canvas.height - 1) {
			let new_pos1 = { ...pos2 };
			let new_po2 = {
				x: (canvas.height - new_pos1.y) / slope + new_pos1.x,
				y: canvas.height,
			};
			let new_slope = -1 * slope;
			let new_hit = Math.floor(new_po2.y - new_slope * new_po2.x);

			return getFinalHit(new_pos1, new_po2, new_slope, new_hit, max_hit);
		}
		return hit;
	}

	function AiBlindMove(p1, moves) {
		if (moves && moves.up && moves.up > 0) {
			p1.moveUp();
			moves.up--;
		} else if (moves && moves.down && moves.down > 0) {
			p1.moveDown();
			moves.down--;
		} else p1.stop();
	}

	function AiHaveJustHitBall(gameObjects, game) {
		let receover_to = getWidthPixels(70);
		if (isAiTurn(gameObjects["ballLastPosition"].x, game.ball.x) &&
			game.ball.x < receover_to)
			return true;
		return false;
	}

	function isAiTurn(previous, current) {
		if (previous - current <= -1) {
			return true;
		} 
		else 
			return false;
	}

	function ballIsHeadingTowardHuman(game) {
		let fieldSecondHalf = getWidthPixels(70);
		if (game.ball.x > fieldSecondHalf) return true;
		return false;
	}

	//---------------------END OF AI ALGORITHM----------------------------//

	function AiTrainer(game) {
		if (game.ball.y > game.p2.y) game.p2.moveDown();
		else if (game.ball.y < game.p2.y) game.p2.moveUp();
		else game.p2.stop();
		// game.p2.moveUp();
	}
};

AIgame();
