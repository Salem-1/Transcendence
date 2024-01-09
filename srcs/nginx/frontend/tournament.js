

document.addEventListener('DOMContentLoaded', function() {
    let start_tournament_btn = document.getElementById("start_tournament");
    if (!start_tournament_btn)
        return ; 
    start_tournament_btn.addEventListener("click", getPlayers);
    try{
        var players = JSON.parse(localStorage.getItem('players')) || [];
    }
    catch (e){
        alert (e);
    }
    var players = [];
    localStorage.setItem('players', JSON.stringify(players));
});

function launchTournament(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length <  2)
    {
        if (players.length == 0)
            alert(`Cannot launch tournament without players`);
        if (players.length == 1)
            alert(`You cannot play the tournament alone Mr introvert, unfortunately you need real human beings to play with, go make some friends then try again.`);
        return;
    }
    alert("starting tournament")
    window.location.href = "tournament_intro.html";
}

function getPlayers() {
    window.location.href = 'register_players.html';
}


function addPlayer() {
    try{
        var players = JSON.parse(localStorage.getItem('players')) || [];
    }
    catch (e){
        alert (e);
    }
    if (! players ||  players.length > 7)
    {
        alert("Max 8 players allowed");
        return;
    }
    var playerNameInput = document.getElementById("player-name");
    var playerName = playerNameInput.value.trim();
    if (!isvalidPlayerName(players, playerName))
        return ;
    players.push(playerName);
    localStorage.setItem('players', JSON.stringify(players));
    playerNameInput.value = '';
    // var table = document.querySelector("table tbody");
    showPlayerName(playerName);
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

function showAllPlayers() {
    var players = JSON.parse(localStorage.getItem('players')) || [];
    var table = document.querySelector("table tbody");
    if (!players ||  players.length > 8)
    {
        players = [];
        localStorage.setItem('players', JSON.stringify(players));
        
    }
    // Display all players in the table
    players.forEach(function(player) {
        showPlayerName(player);
    });
}

function isvalidPlayerName(players, playerName){
    if (!playerName || playerName === '' || playerName.length > 35) {
        alert("Please enter a valid player name.");
        return (false) ;
    }
    if (players.indexOf(playerName) !== -1)
    {
        alert("Player already added");
        return (false) ;
    }
    return (true);
}


let callback = function (MutationList, observer){
    var delete_buttons = document.getElementsByClassName('delete-button');
    for (var i = 0; i < delete_buttons.length; i++) {
        delete_buttons[i].addEventListener("click", function(){
            let parent_node = this.parentElement;
            let row = parent_node.parentElement;
            let playerName = parent_node.previousElementSibling.textContent;
            let players = JSON.parse(localStorage.getItem('players')) || [];
            let playerIndex = players.indexOf(playerName);
            if (playerIndex == -1)
            {
                return ;
            }
            players.splice(playerIndex, 1);
            localStorage.setItem('players', JSON.stringify(players));
            row.parentElement.removeChild(row);
        });
    }
}

let targetNode = document.body;
const config = {
    childList: true,
    CharacterData: true,
    subtree: true,
    attributes: true,
}

const observer = new MutationObserver(callback);

try{
    showAllPlayers();
    observer.observe(targetNode, config);
}
catch (e){
    alert(e)
}