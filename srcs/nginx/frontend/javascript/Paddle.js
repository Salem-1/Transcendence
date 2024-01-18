// import {PADDLE_HEIGHT, PADDLE_SPEED} from './constants.js';

export default class Paddle {
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
