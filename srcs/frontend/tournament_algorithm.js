
initTournament();

function initTournament(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length < 2)
    {
        alert("error: not enough players for the tournament");
        window.location.href = "http://localhost:3000/register_players.html";
        return ;
    }
    let round = fillRound(players);
    let level = getLevel(round);
    displayFirstRound(round, level);
    startTournament(round, level);

}

function playGame(player1, player2){
    if (!player2)
        return (player1);
    else if (confirm(`${player1} wins?`))
        return (player1);
    else 
        return (player2);
}

function    playFinals(round, level){
    const newButton = document.createElement('button');
    newButton.textContent = 'Play next game';
    document.body.appendChild(newButton);
    newButton.onclick = function () {
       let winner =  playGame(round[0][0], round[0][1]);
       localStorage.setItem("winner", winner);
       displayWinner(winner);
    };
    // winner = localStorage.getItem("winner");
    // if (!winner)
    //     return ("no body wins");    
    // alert(`the winner is ${winner}`);
    return (winner);
}



function    startTournament(round, level){
    let winner = "";
    if (level == 1)
        winner = playFinals(round, level);
    else if (level == 2){

    }
    else if (level == 3){

    }
    else{
        throw new Error("Invalid number of players");
    }
    displayWinner(winner);
}



function    displayWinner(winner){
    let winning_element = document.getElementById("winner");
    showOnePlayer(winning_element, winner);
}


function displayFirstRound(round, level){
    if (level == 1){
        displayFinals(round);
    }
    else if (level == 2){
        displaySemiFinal(round);
    }
    else if (level == 3){
        displayQuarterFinal(round);
    }
}


function displayQuarterFinal(round){
    let player1 = document.getElementById("quarter-final-t1");
    let player2 = document.getElementById("quarter-final-t2");
    let player3 = document.getElementById("quarter-final-t3");
    let player4 = document.getElementById("quarter-final-t4");
    let player5 = document.getElementById("quarter-final-t5");
    let player6 = document.getElementById("quarter-final-t6");
    let player7 = document.getElementById("quarter-final-t7");
    let player8 = document.getElementById("quarter-final-t8");

    showOnePlayer(player1, round[0][0]);
    showOnePlayer(player2, round[0][1]);
    showOnePlayer(player3, round[1][0]);
    showOnePlayer(player4, round[1][1]);
    showOnePlayer(player5, round[2][0]);
    showOnePlayer(player6, round[2][1]);
    showOnePlayer(player7, round[3][0]);
    showOnePlayer(player8, round[3][1]);
}
function displaySemiFinal(round){
    let player1 = document.getElementById("semi-final-t1")
    let player2 = document.getElementById("semi-final-t2")
    let player3 = document.getElementById("semi-final-t3")
    let player4 = document.getElementById("semi-final-t4")

    showOnePlayer(player1, round[0][0]);
    showOnePlayer(player2, round[0][1]);
    showOnePlayer(player3, round[1][0]);
    showOnePlayer(player4, round[1][1]);
}

function showOnePlayer(player_place, playername){
    if (!playername)
        playername = "";
    player_place.innerText  = playername;
    player_place.style.display  = 'inline';
}

function displayFinals(round){
    let player1 = document.getElementById("final-t1")
    let player2 = document.getElementById("final-t2")
    showOnePlayer(player1, round[0][0]);
    showOnePlayer(player2, round[0][1]);
}
// throw new Error('Invalid input')
function    fillRound(players){
    if (!players || players.length < 2 || players.length > 8)
        throw new Error("Invalid players array size");
    let local_players = [...players];
    let match = [];
    let rounds = {};
    let i = 0;
    while (local_players.length > 0)
    {
        allocatePlayer(local_players, match, 0)
        if (Object.keys(local_players).length != 0)
            allocatePlayer(local_players, match, 1)
        else
            match[1] = null;
        rounds[i] = match;
        match = []
        i++;
    }
    return (rounds);
}

function getLevel(rounds){
    let num_rounds = Object.keys(rounds).length;
    if (num_rounds < 1 || num_rounds > 4)
        throw new Error("incorrect number of matches in the round");
    return (num_rounds == 4 ? 3 : num_rounds )
}


function allocatePlayer(local_players, match, index){
    let random_player = 0;
    random_player = Math.floor(Math.random() * local_players.length);
    match[index] = local_players[random_player];
    local_players.splice(random_player, 1);
    if (local_players.includes(match[index]))
        throw new Error("Repeated player!")
}

function showAllPlayers() {
    var players = JSON.parse(localStorage.getItem('players')) || [];
    var table = document.querySelector("table tbody");
    if (players.length < 2)
    {
        players = [];
        localStorage.setItem('players', JSON.stringify(players));
        
    }
    // Display all players in the table
    players.forEach(function(player) {
        showPlayerName(player);
    });
}

function showPlayerName(playerName) {
    var players = JSON.parse(localStorage.getItem('players')) || [];
    var table = document.querySelector("table tbody");
    var row = table.insertRow(-1);
    row.id = "playerRow-" + playerName; // Example: playerRow-john-doe
    var cell1 = row.insertCell(0);
    cell1.textContent = playerName;
    var cell2 = row.insertCell(1);
    var button = document.createElement("button");
    button.textContent = "X";
    button.classList.add("delete-button")
    console.log(`players now [${players}]'n`)
    cell2.appendChild(button);
}

// module.exports = {
//     fillRound: fillRound,
//     getLevel: getLevel,

// };

// //["1","2","3","4","5","6","7","8"]