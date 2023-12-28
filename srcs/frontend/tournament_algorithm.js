// displayFirstRound();


// throw new Error('Invalid input')
function    fillRound(players){
    if (!players || players.length < 2 || players.length > 8)
        throw new Error("Invalid players array size");
    let local_players = [...players];
    let match = [];
    let rounds = {};
    let i = 0;
    let random_player = 0;
    while (local_players.length > 0){
        random_player = Math.floor(Math.random() * local_players.length);
        match[0] = local_players[random_player];
        local_players.splice(random_player, 1);
        if (local_players.includes(match[0]))
            throw new Error("Repeated player!")
            if (Object.keys(local_players).length != 0){
                random_player = Math.floor(Math.random() * local_players.length);
                match[1] = local_players[random_player];
                local_players.splice(random_player, 1);
                if (local_players.includes(match[1]))
                    throw new Error("Repeated player!")
        }
        else{
            match[1] = null;
        }
        rounds[i] = match;
        match = []
        i++;
    }
    // console.log(players);
    // console.log({rounds});
    return (rounds);
}

function displayFirstRound(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length < 2)
    {
        alert("error: not enough players for the tournament");
        window.location.href = "http://localhost:3000/register_players.html";
        return ;
    }
    round1 = fillRound(plyaers);
    alert(`we have ${players.length} players let's start the game`)
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

module.exports = {
    fillRound: fillRound,

};

// //["1","2","3","4","5","6","7","8"]