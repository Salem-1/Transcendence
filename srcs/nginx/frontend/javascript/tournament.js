
// window.onpopstate = deleteStoredPlayers;

function deleteStoredPlayers(){
    var players = [];
    localStorage.setItem('players', JSON.stringify(players));
}

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

async function launchTournament(){
    var players = JSON.parse(localStorage.getItem('players')) || [];
    if (players.length <  2)
    {
        if (players.length == 0)
			alert(`${await getTranslation("zero players")}`)
		if (players.length == 1)
			alert(`${await getTranslation("one player")}`)
		return;
    }
	alert(`${await getTranslation("starting tournament")}`)
	callRoute("/tournament");
}

function getPlayers() {
	callRoute("/register_players");
}


async function addPlayer() {
    try{
        var players = JSON.parse(localStorage.getItem('players')) || [];
    }
    catch (e){
        alert (e);
    }
    if (! players ||  players.length > 7)
    {
		alert(`${await getTranslation("max players")}`)
        return;
    }
    var playerNameInput = document.getElementById("player-name");
    var playerName = playerNameInput.value.trim();
    if (!await isvalidPlayerName(players, playerName))
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
    button.classList.add("btn")
    button.classList.add("btn-danger")
    console.log(`players now [${players}]'n`)
    cell2.appendChild(button);
	var tablebody = document.querySelector("table tbody");
	tablebody.scrollTop = tablebody.scrollHeight;
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

async function isvalidPlayerName(players, playerName){
    if (
        !playerName || playerName === '' || playerName.length > 14
        || (/[ !@#$%^&*(),.;?":{}|<>' ]/.test(playerName))
        ) {
		alert(`${await getTranslation("invalid player name")}`)
        return (false) ;
    }
    if (players.indexOf(playerName) !== -1)
    {
		alert(`${await getTranslation("player exists")}`)
        return (false) ;
    }
    return (true);
}


callback = function (MutationList, observer){
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

targetNode = document.body;
config = {
    childList: true,
    CharacterData: true,
    subtree: true,
    attributes: true,
}

observer = new MutationObserver(callback);


try{
    deleteStoredPlayers();
    showAllPlayers();
    observer.observe(targetNode, config);
}
catch (e){
    alert(e)
}