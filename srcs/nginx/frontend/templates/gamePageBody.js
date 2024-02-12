function gamePageBody(){
    return (`
    <div class='score'>
        <span id='player1' class='user'>Player 1</span><span id='score1'>0</span>
        <span>-</span>
        <span id='score2'>0</span><span id='player2' class='user'>Player 2</span>
    </div>
    <div class='pause' id='pause'> Paused </div>
    <canvas id="canvas"></canvas>
    `);
}
