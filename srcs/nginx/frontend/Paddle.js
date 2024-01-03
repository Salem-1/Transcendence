import {PADDLE_HEIGHT, PADDLE_SPEED} from './constants.js';

export default class Paddle {
    constructor(element) {
        this.element = element;
        this.direction = {x: 0, y: 0};
        this.y = 0;
        this.reset();
    }

    reset() {
        this.y = 40;
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
        if (this.y + dy < 0) {
            this.y = 1;
        } else if (this.y + dy > 100 - PADDLE_HEIGHT) {
            this.y = 99 - PADDLE_HEIGHT;
        } else {
            this.y += dy;
        }
        this.y += dy;
        this.element.style.setProperty('top', `${this.y}vh`);
    }
}
