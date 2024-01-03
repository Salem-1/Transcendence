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

let t2 = -1;
function gameLoop(currentTime) {
    if (t2 !== -1) {
        const dt = (currentTime - t2);
        p1.update(dt);
        p2.update(dt);
        ball.update(dt);
    }
    t2 = currentTime;
    
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
