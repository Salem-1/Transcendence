// import {
//     BALL_HEIGHT,
//     BALL_WIDTH,
//     BALL_SPEED,
//     PADDLE_HEIGHT,
//     PADDLE_WIDTH
// } from './constants.js';

export default class Ball {
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
