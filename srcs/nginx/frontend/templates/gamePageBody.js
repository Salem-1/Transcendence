function gamePageBody(){
    return (`
    <div class='score'>
        <span id='player1' class='user' data-i18n="player 1">player 1</span><span id='score1'>0</span>
        <span>-</span>
        <span id='score2'>0</span><span id='player2' class='user' data-i18n="player 2">Player 2</span>
    </div>
    <div class='pause' id='pause' data-i18n="game paused"> Paused </div>
    <canvas id="canvas"></canvas>
    `);
}
