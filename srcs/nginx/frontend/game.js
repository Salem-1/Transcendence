import Paddle from "./Paddle.js";
import Ball from "./Ball.js";

const p1 = new Paddle(document.getElementById('p1'));
const p2 = new Paddle(document.getElementById('p2'));
const ball = new Ball(document.getElementById('ball'));

document.addEventListener('keydown', (event) => {
    switch (event.key) {
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

document.addEventListener('keyup', (event) => {
    switch (event.key) {
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

let lastTimestamp = 0;
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTimestamp) / 1000;

    p1.update(deltaTime);
    p2.update(deltaTime);
    ball.update(deltaTime, p1, p2);

    lastTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
