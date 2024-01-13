import Paddle from "./Paddle.js";
import Ball from "./Ball.js";

const p1 = new Paddle(document.getElementById('p1'));
const p2 = new Paddle(document.getElementById('p2'));
const ball = new Ball(document.getElementById('ball'));
let pause = false;

document.addEventListener('keydown', (event) => {
	const key = event.key.length == 1 ?
		event.key.toLowerCase() : event.key
    switch (key) {
		case 'p':
			pause = !pause;
			const pauseElement = document.getElementById('pause');
			if (pause)
			{
				pauseElement.style.setProperty('visibility', 'visible');
			} else {
				pauseElement.style.setProperty('visibility', 'hidden');
			}
			break;
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
	const key = event.key.length == 1 ?
		event.key.toLowerCase() : event.key
    switch (key) {
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
	if (!pause)
	{
		p1.update(deltaTime);
		p2.update(deltaTime);
		ball.update(deltaTime, p1, p2);
	}
    lastTimestamp = timestamp;
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);
