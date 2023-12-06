

document.addEventListener('DOMContentLoaded', function() {
    let start_tournament_btn = document.getElementById("start_tournament");
    if (!start_tournament_btn)
    return ; 
    start_tournament_btn.addEventListener("click", getPlayers);
    var players = JSON.parse(localStorage.getItem('players')) || [];
    var players = [];
    localStorage.setItem('players', JSON.stringify(players));
});

function getPlayers() {
    window.location.href = 'register_players.html';
    alert("Please enter players names to start Tournament!");
}


function addPlayer() {
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length > 7)
    {
        alert("Max 8 players allowed");
        return;
    }
    var playerNameInput = document.getElementById("player-name");
    var playerName = playerNameInput.value.trim();
    if (!playerName || playerName === '' || playerName.length > 35) {
        alert("Please enter a valid player name.");
        return;
    }
    if (players.indexOf(playerName) !== -1)
    {
        alert("Player already added");
        return;
    }
    players.push(playerName);
    localStorage.setItem('players', JSON.stringify(players));
    playerNameInput.value = '';
    
    showPlayerName(playerName, players);
}


function showPlayerName(playerName, players) {
    var table = document.querySelector("table tbody");
    var row = table.insertRow(-1);
    row.id = "playerRow-" + playerName; // Example: playerRow-john-doe
    var cell1 = row.insertCell(0);
    cell1.textContent = playerName;
    var cell2 = row.insertCell(1);
    var button = document.createElement("button");
    button.textContent = "X";
    button.onclick = function () {
        var rowId = row.id;
        var playerIndex = players.indexOf(playerName);
        console.log(`${playerName} ${playerIndex}, Id ${row.id}`)
        if (playerIndex !== -1) {
            players.splice(playerIndex, 1);
            localStorage.setItem('players', JSON.stringify(players));
        }
        row.parentNode.removeChild(row);
    };
    cell2.appendChild(button);
}

function showAllPlayers() {
    var players = JSON.parse(localStorage.getItem('players')) || [];
    var table = document.querySelector("table tbody");
    
    // table.innerHTML = '';
    if (players.length > 8)
    {
        players = [];
        localStorage.setItem('players', JSON.stringify(players));
        
    }
    // Display all players in the table
    players.forEach(function(player) {
        showPlayerName(player, players);
    });
}

showAllPlayers();