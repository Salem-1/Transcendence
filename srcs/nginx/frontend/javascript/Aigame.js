const PADDLE_SPEED = 50;
const BALL_SPEED =  150 ;
const PADDLE_HEIGHT = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--paddle-height"));
const PADDLE_WIDTH = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--paddle-width"));
const BALL_WIDTH = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--ball-width"));
const BALL_HEIGHT = parseFloat(getComputedStyle(document.body).
    getPropertyValue("--ball-height"));
const CENTER = 40;
let moves = {};
let hitPoints = [];

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
        if (this.direction.x < 0){
            this.position.x = 90;
        }
        else{
            this.position.x = 10;
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

const p1 = new Paddle(document.getElementById('p1'));
const p2 = new Paddle(document.getElementById('p2'));
const ball = new Ball(document.getElementById('ball'));
let pause = false;

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
				pauseElement.style.setProperty('visibility', 'visible');
			} else {
				pauseElement.style.setProperty('visibility', 'hidden');
			}
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

document.addEventListener('keyup', (event) => {
	const key = event.key.length == 1 ?
		event.key.toLowerCase() : event.key
    switch (key) {
        case 'ArrowUp':
            p2.stop();
            break;
        case 'ArrowDown':
            p2.stop();
            break;
        }
    });


let gameObjects = {};
let lastTimestamp = 0;
gameObjects["p1"] = p1;
gameObjects["p2"] = p2;
gameObjects["ball"] = ball;
gameObjects["lastMinute"] = 0;
gameObjects["currentMinute"] = 0;
gameObjects["ballLastPosition"] = ball.position

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    gameObjects["deltaTime"] = deltaTime;
    gameObjects["currentMinute"] = Math.floor(timestamp / 1000);
	if (!pause)
	{
        updatePositions(gameObjects);
        if (gameObjects["currentMinute"] > gameObjects["lastMinute"]){
            try{
                moves = decideNextMoves(gameObjects);
            }
            catch {
                moves = {up:1};
            }
            gameObjects["ballLastPosition"] = {...ball.position}
        }
        // AiTrainer(gameObjects["p2"], gameObjects["ball"]);
        AiBlindMove(moves);
    }
    lastTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

function updatePositions(gameObjects){
    gameObjects["p1"].update(gameObjects["deltaTime"]);
    gameObjects["p2"].update(gameObjects["deltaTime"]);
    gameObjects["ball"].update(gameObjects["deltaTime"], gameObjects["p1"], gameObjects["p2"]);
}

//--------------------------AI Alogrith------------------------------------//

function    decideNextMoves(gameObjects){
    if (AiHaveJustHitBall(gameObjects))
        moves = recoverToCenter(gameObjects);
    else if (isAiTurn(gameObjects["ballLastPosition"].x, gameObjects["ball"].position.x) 
            && ballIsHeadingTowardHuman(gameObjects))
        moves = counterHumanPaddel(gameObjects);
    else
        moves = AiPlay(gameObjects);
    return (moves);
}

function counterHumanPaddel(gameObjects){
    let counter_margin = 10;

    if (gameObjects["p2"].position.y > CENTER && gameObjects["p1"].position.y > CENTER)
        moves = {up: gameObjects["p1"].position.y - CENTER  
                + gameObjects["p2"].position.y - CENTER + counter_margin, down: 0,}
    else if (gameObjects["p2"].position.y < CENTER && gameObjects["p1"].position.y < CENTER)
        moves = {down: CENTER - gameObjects["p1"].position.y 
                + CENTER - gameObjects["p2"].position.y, up: 0}
    else
        moves = {stop: 0, up: 0, down: 0}
    return (moves);
}


function recoverToCenter(gameObjects){
    let center_margin = 5;
    if (p1.position.y > CENTER  - center_margin)
        moves = {up: p1.position.y -  CENTER  - center_margin, down:0}
    else if (p1.position.y < CENTER + center_margin)
        moves = {down:  CENTER - p1.position.y  - center_margin, up:0}
    else      
        moves = {stop: 0, up:0, down:0}
    return (moves);
}

function AiPlay(gameObjects){
    let move_margin = 10;

    hitPoints.push(getHitPoint(gameObjects)) ;
    let chosenHitPoint = getChosenPoint(hitPoints);
    console.log(`[${hitPoints}] choosed ${chosenHitPoint}`);
    if (p1.position.y > chosenHitPoint)
        moves = {up: Math.floor((p1.position.y  - chosenHitPoint) / 0.83) 
                    + move_margin + 3, down: 0}
    else if (p1.position.y < chosenHitPoint)
        moves = {down: Math.floor((chosenHitPoint - p1.position.y) / 0.83) 
                    - move_margin, up: 0}
    else
        moves = {stop: 0, up:0, down:0};
    gameObjects["lastMinute"] = gameObjects['currentMinute'];
    return (moves);
}

function getHitPoint(gameObjects){
    let pos1 = {x: gameObjects["ballLastPosition"].x, y: gameObjects["ballLastPosition"].y}
    let pos2 = {x: ball.position.x, y: ball.position.y}
    let slope = (pos2.y  - pos1.y ) / (pos2.x - pos1.x ) 
    let hit = Math.floor(pos2.y - slope * pos2.x);
    hit = getFinalHit(pos1, pos2, slope ,hit);

    return hit;
}

function getChosenPoint(hitPoints){
    let occurances = [];
    for (let point in hitPoints){
        let prop = 0;
        for (let i in hitPoints){
            if (hitPoints[point]+ 10  >= hitPoints[i] 
                    && hitPoints[point] - 10 <= hitPoints[i])
                prop++;
        }
        occurances.push(prop);
    }
    return hitPoints[occurances.indexOf(Math.max(...occurances))];
}

function getFinalHit(pos1, pos2, slope ,hit){
    if (hit > -1 && hit < 101)
        return (hit);
    if (hit < 0){
        let new_pos1 = {...pos2}
        let new_po2 = {x: -1 * (new_pos1.y / slope ) + new_pos1.x, y: 0};
        let new_slope = -1 * slope;
        let new_hit = Math.floor(new_po2.y - new_slope * new_po2.x);

        return getFinalHit(new_pos1, new_po2, new_slope ,new_hit)
    }
    else if (hit > 99){
        let new_pos1 = {...pos2}
        let new_po2 = {x: (100 - new_pos1.y) / slope + new_pos1.x, y: 100};
        let new_slope = -1 * slope;
        let new_hit = Math.floor(new_po2.y - new_slope * new_po2.x);

        return getFinalHit(new_pos1, new_po2, new_slope ,new_hit)
    }
    return (hit);
}

function AiBlindMove(moves){

    if (moves && moves.up && moves.up > 0){
            p1.moveUp();
            moves.up--;
    }
    else if (moves && moves.down && moves.down > 0){
        p1.moveDown();
        moves.down--;
    }
    else
        p1.stop();
}

function AiHaveJustHitBall(gameObjects){
    let receover_to = 50;
    if (isAiTurn(gameObjects["ballLastPosition"].x, ball.position.x) 
        && ball.position.x < receover_to)
        return (true);
    return (false);
}

function isAiTurn(previous, current){
    if (previous * 1000  - current * 1000 <= 0.2){
        hitPoints = [];
        return (true);
    }
    else
        return (false);
}

function    ballIsHeadingTowardHuman(gameObjects){
    let fieldSecondHalf = 50;
    
    if (gameObjects["ball"].position.x > fieldSecondHalf)
        return (true);
    return (false);
}

//---------------------END OF AI ALGORITHM----------------------------//

function AiTrainer(p2, ball){
    if (ball.position.y > p1.position.y)
        p2.moveDown();
    else if (ball.position.y < p1.position.y)
        p2.moveUp();
    else
        p2.stop()
}