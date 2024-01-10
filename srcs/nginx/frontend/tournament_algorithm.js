
try {
	// const location = window.location.pathname;
	// if (location === "/tournament")
	// {
		initTournament();
		
		// const tempbutton = document.getElementById("start-tournament");
		// if (tempbutton)
		// 	tempbutton.remove();
		// const newButton = document.createElement('button');
		// newButton.textContent = 'Start tournament';
		// newButton.id = "start-tournament";
		// document.body.appendChild(newButton);
		// newButton.onclick = function () {
		// 	startTournament(); 
		// };
	// }
}
catch (e){
    alert(`${e}`);
	callRoute("/register_players");
    // window.location.href = "http://localhost:3000/landing.html";

}

function initTournament(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (!players || players.length < 2 || players.length > 8)
        throw new Error("not enough players");
    let round = fillRound(players);
    let level = getLevel(round);
    let roundJSON = JSON.stringify(round);
    localStorage.setItem('round', roundJSON);
    localStorage.setItem('level', level.toString());
    displayRound(round, level);
}

function playGame(player1, player2){
    if (!player2)
        return (player1);
    else if (confirm(`${player1} wins ${player2}?`))
        return (player1);
    else 
        return (player2);
}

function    playFinals(round){    
    return(playGame(round[0][0], round[0][1]));
}



function    startTournament(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    let storedRoundJSON = localStorage.getItem('round');
    let storedLevelString = localStorage.getItem('level');
    let round = JSON.parse(storedRoundJSON);
    let level = parseInt(storedLevelString);
    if (!players || players.length < 2 || players.length > 8 || !round || !level)
        throw new Error("error: fetching players for the tournament");
    let winner = "";
    if (level == 1)
        winner = playFinals(round);
    else if (level == 2)
        winner = playSemiFinals(round);
    else if (level == 3)
        winner = playQuarterFinals(round);
    else
        throw new Error("Invalid number of players");
    displayWinner(winner);
}

function    playQuarterFinals(round){

    let round3 = {"0": [
                        playGame(round[0][0], round[0][1]), 
                        playGame(round[1][0], round[1][1])
                    ],
                    "1": [
                        playGame(round[2][0], round[2][1]), 
                        round[3] ? playGame(round[3][0], round[3][1]) : null ,
                    ], 
                    }
    displaySemiFinal(round3);          
    return (playSemiFinals(round3));

}

function playSemiFinals(round){
    let round2 = {"0": [
                        playGame(round['0'][0], round['0'][1]),
                        playGame(round['1'][0], round['1'][1])
                  ]};
    displayFinals(round2);
    return (playFinals(round2));
}

function    displayWinner(winner){
    let winning_element = document.getElementById("winner");
    showOnePlayer(winning_element, winner);
}


function displayRound(round, level){
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

function showOnePlayer(player_place, playername){
    if (!playername)
        playername = "";
    player_place.innerText  = playername;
    player_place.style.display  = 'inline';
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

// function    displayPlayers(round){
//     let players_elements = [];
//     for (let i = 0; i < Object.keys(round).length * 2 ; i++){
//         players_elements[i] = document.getElementById(`quarter-final-t${i + 1}`);
//     }
//     let odd = 0;
//     round_counter = 0;
//     for (let i = 0; i < Object.keys(round).length * 2 ; i++){
//         if (!players_elements[i])
//             continue ;
        
//         if (!round[round_counter] || !round[round_counter][odd])
//             break;
//         showOnePlayer(players_elements[i], round[round_counter][odd])
//         if (odd == 1)
//         {
//             odd = 0;
//             round_counter++;
//         }
//         else
//             odd = 1;
//     }
//     showOnePlayer(player1, round[0][0]);
//     showOnePlayer(player2, round[0][1]);

// }

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
    if (player5 && round[2]) showOnePlayer(player5, round[2][0]);
    if (player6 && round[2]) showOnePlayer(player6, round[2][1]);
    if (player7 && round[3]) showOnePlayer(player7, round[3][0]);
    if (player8 && round[3]) showOnePlayer(player8, round[3][1]);
}
function displaySemiFinal(round){
    let player1 = document.getElementById("semi-final-t1")
    let player2 = document.getElementById("semi-final-t2")
    let player3 = document.getElementById("semi-final-t3")
    let player4 = document.getElementById("semi-final-t4")

    if (player1 && round[0]) showOnePlayer(player1, round[0][0]);
    if (player2 && round[0]) showOnePlayer(player2, round[0][1]);
    if (player3 && round[1]) showOnePlayer(player3, round[1][0]);
    if (player4 && round[1]) showOnePlayer(player4, round[1][1]);
}

function displayFinals(round){
    let player1 = document.getElementById("final-t1")
    let player2 = document.getElementById("final-t2")
    showOnePlayer(player1, round[0][0]);
    showOnePlayer(player2, round[0][1]);
}


// module.exports = {
//     fillRound: fillRound,
//     getLevel: getLevel,

// };

// //["1","2","3","4","5","6","7","8"]