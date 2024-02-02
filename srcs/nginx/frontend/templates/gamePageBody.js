function gamePageBody(){
    return (`
    <div class='score'>
        <span id='score1'>0</span>
        <span>-</span>
        <span id='score2'>0</span>
    </div>
    <div class='pause' id='pause'> Paused </div>
    <canvas id="canvas" width="800" height="400"></canvas>
    `);
}
