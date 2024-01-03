import { BALL_HEIGHT, BALL_WIDTH, BALL_SPEED, PADDLE_HEIGHT } from './constants.js';

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

    update(dt, p1, p2) {
        const dx = this.direction.x * BALL_SPEED * dt;
        const dy = this.direction.y * BALL_SPEED * dt;
        const topPosition = this.position.y - 0.5 * BALL_HEIGHT;
        const bottomPosition = this.position.y + 0.5 * BALL_HEIGHT;
        const leftPosition = this.position.x - 0.5 * BALL_WIDTH;
        const rightPosition = this.position.x + 0.5 * BALL_WIDTH;
        if (topPosition + dy <= 0) {
            this.direction.y = 1;
        } else if (bottomPosition + dy >= 100) {
            this.direction.y = -1;
        } else {
            this.position.y += dy;
        }
        if (leftPosition + dx <= 0) {
            if (topPosition + dy >= p1.y && bottomPosition + dy <= p1.y + PADDLE_HEIGHT) {
				this.direction.x = 1;
			} else {
				p2.score += 1;
				this.reset();
			}
        } else if (rightPosition + dx >= 100) {
            if (topPosition + dy >= p2.y && bottomPosition + dy <= p2.y + PADDLE_HEIGHT) {
				this.direction.x = -1;
			} else {
				p1.score += 1;
				this.reset();
			}
        } else {
            this.position.x += dx;
        }
        this.element.style.setProperty('left', `${this.position.x}vw`);
        this.element.style.setProperty('top', `${this.position.y}vh`);
		console.log(p1.score, p2.score);
    }
}
