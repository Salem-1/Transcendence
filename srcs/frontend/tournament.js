function getPlayers() {
    window.location.href = 'register_players.html';
    alert("Please enter players names to start Tournament!");
}

// Fix the typo in the variable name
let start_tournament_btn = document.getElementById("start_tournament");
start_tournament_btn.addEventListener("click", getPlayers);
