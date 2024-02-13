try {
  initTournament();
} catch (e) {
  alert(`${e}`);
  callRoute("/home");
}

function initTournament() {
  if (localStorage.getItem("round") !== null) {
    startTournament();
    return;
  }
  let players = JSON.parse(localStorage.getItem("players")) || [];
  let round = fillRound(players);
  let level = getLevel(round);
  let roundJSON = JSON.stringify(round);
  localStorage.setItem("round", roundJSON);
  localStorage.setItem("level", level.toString());
  localStorage.setItem("roundWinners", JSON.stringify({}));
  localStorage.setItem("levelRound", JSON.stringify({}));
  updateLevelRound();
  displayRound();
}

async function startTournament() {
  let players = JSON.parse(localStorage.getItem("players")) || [];
  let storedRoundJSON = localStorage.getItem("round");
  let storedLevelString = localStorage.getItem("level");
  let round = JSON.parse(storedRoundJSON);
  let level = parseInt(storedLevelString);

  if (
    !players ||
    players.length < 2 ||
    players.length > 8 ||
    !round ||
    level === null
  )
    throw new Error("error: fetching players for the tournament");

  if (level == 0) {
    displayRound();
    localStorage.clear();
  } else if (level == 1) playFinals(round);
  else if (level == 2) playSemiFinals(round);
  else if (level == 3) playQuarterFinals(round);
  else throw new Error("Invalid number of players");
}

/**
 *
 * @param {*} player1
 * @param {*} player2
 *
 * This function will route to /game?tournament=true?player1=player1&player2=player2
 * Game.js will read the query string and start the game with the two players.
 * Once the game is over game.js will remove the loser VALUE and not KEY from the local storage
 *  and callRoute to /tournament
 * so if a player doesnt have a name the game will not start
 *
 */
function playTournamentGame(player1, player2) {
  const url = `/game?tournament=true&player1=${player1}&player2=${player2}`;
  callRoute(url);
}

function getMatchWinner(round) {
  let roundObject = JSON.parse(localStorage.getItem("round")) || {};
  let roundWinners = JSON.parse(localStorage.getItem("roundWinners")) || {};
  if (!roundObject[round][0] || !roundObject[round][1]) {
    roundWinners[round] =
      roundObject[round][0] == null
        ? roundObject[round][1]
        : roundObject[round][0];
    localStorage.setItem("roundWinners", JSON.stringify(roundWinners));
  }
  return roundWinners[round];
}

function updateLevelRound() {
  const levelRound = JSON.parse(localStorage.getItem("levelRound")) || {};
  levelRound[localStorage.getItem("level")] = {
    rounds: { ...JSON.parse(localStorage.getItem("round")) },
    roundWinners: { ...JSON.parse(localStorage.getItem("roundWinners")) },
  };
  localStorage.setItem("levelRound", JSON.stringify(levelRound));
}

function playFinals(round) {
  const winner = getMatchWinner("0");
  if (winner) {
    updateLevelRound();
    localStorage.setItem("round", JSON.stringify({ 0: [winner, null] }));
    localStorage.setItem("level", 0);
    storeWinnerOnBlockchain(winner);
    startTournament();
    return;
  }
  playTournamentGame(round[0][0], round[0][1]);
}

function  storeWinnerOnBlockchain(winner){
  try{
    const response =  fetch("https://localhost:443/api/set_winner/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ winner}),
		});
  }
  catch (e){
    console.log(e);
  }
  
}

function playSemiFinals(round) {
  const winner1 = getMatchWinner("0");
  if (winner1) {
    const winner2 = getMatchWinner("1");
    if (winner2) {
      updateLevelRound();
      localStorage.setItem("round", JSON.stringify({ 0: [winner1, winner2] }));
      localStorage.setItem("level", 1);
      localStorage.setItem("roundWinners", JSON.stringify({}));
      startTournament();
      return;
    } else {
      playTournamentGame(round["1"][0], round["1"][1]);
    }
  } else {
    playTournamentGame(round["0"][0], round["0"][1]);
  }
}

function playQuarterFinals(round) {
  const winner1 = getMatchWinner("0");
  if (winner1) {
    const winner2 = getMatchWinner("1");
    if (winner2) {
      const winner3 = getMatchWinner("2");
      if (winner3) {
        if (round["3"] == null) {
          updateLevelRound();
          localStorage.setItem(
            "round",
            JSON.stringify({ 0: [winner1, winner2], 1: [winner3, null] })
          );
          localStorage.setItem("level", 2);
          localStorage.setItem("roundWinners", JSON.stringify({}));
          startTournament();
          return;
        }
        const winner4 = getMatchWinner("3");
        if (winner4) {
          updateLevelRound();
          localStorage.setItem(
            "round",
            JSON.stringify({ 0: [winner1, winner2], 1: [winner3, winner4] })
          );
          localStorage.setItem("level", 2);
          localStorage.setItem("roundWinners", JSON.stringify({}));
          startTournament();
          return;
        } else {
          playTournamentGame(round["3"][0], round["3"][1]);
        }
      } else {
        playTournamentGame(round["2"][0], round["2"][1]);
      }
    } else {
      playTournamentGame(round["1"][0], round["1"][1]);
    }
  } else {
    playTournamentGame(round["0"][0], round["0"][1]);
  }
}

function displayWinner(winner) {
  let winning_element = document.getElementById("winner");
  console.log(`winner is ${winner}`);
  if (winner && winner.length > 0) {
  	showOnePlayer(winning_element, winner);
  }
}
function displayRound() {
  const levelRound = JSON.parse(localStorage.getItem("levelRound")) || {};
  displayWinner(getMatchWinner("0") || {});
  if (levelRound["1"] && levelRound["1"]["rounds"])
    displayFinals(levelRound["1"]["rounds"] || {});
  if (levelRound["2"] && levelRound["2"]["rounds"])
    displaySemiFinal(levelRound["2"]["rounds"] || {});
  if (levelRound["3"] && levelRound["3"]["rounds"])
    displayQuarterFinal(levelRound["3"]["rounds"] || {});
}

function showOnePlayer(player_place, playername) {
  if (!playername) playername = "* WildCard *";

  player_place.innerText = playername;
  player_place.style.display = "inline";
}

function fillRound(players) {
  if (!players || players.length < 2 || players.length > 8)
    throw new Error("Invalid players array size");
  let local_players = [...players];
  let match = [];
  let rounds = {};
  let i = 0;
  while (local_players.length > 0) {
    allocatePlayer(local_players, match, 0);
    if (Object.keys(local_players).length != 0)
      allocatePlayer(local_players, match, 1);
    else match[1] = null;
    rounds[i] = match;
    match = [];
    i++;
  }
  return rounds;
}

function getLevel(rounds) {
  let num_rounds = Object.keys(rounds).length;
  if (num_rounds < 1 || num_rounds > 4)
    throw new Error("incorrect number of matches in the round");
  return num_rounds == 4 ? 3 : num_rounds;
}

function allocatePlayer(local_players, match, index) {
  let random_player = 0;
  random_player = Math.floor(Math.random() * local_players.length);
  match[index] = local_players[random_player];
  local_players.splice(random_player, 1);
  if (local_players.includes(match[index])) throw new Error("Repeated player!");
}

function showAllPlayers() {
  var players = JSON.parse(localStorage.getItem("players")) || [];
  var table = document.querySelector("table tbody");
  if (players.length < 2) {
    players = [];
    localStorage.setItem("players", JSON.stringify(players));
  }
  // Display all players in the table
  players.forEach(function (player) {
    showPlayerName(player);
  });
}

function showPlayerName(playerName) {
  var players = JSON.parse(localStorage.getItem("players")) || [];
  var table = document.querySelector("table tbody");
  var row = table.insertRow(-1);
  row.id = "playerRow-" + playerName;
  var cell1 = row.insertCell(0);
  cell1.textContent = playerName;
  var cell2 = row.insertCell(1);
  var button = document.createElement("button");
  button.textContent = "X";
  button.classList.add("delete-button");
  console.log(`players now [${players}]'n`);
  cell2.appendChild(button);
}

function displayQuarterFinal(round) {
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
function displaySemiFinal(round) {
  let player1 = document.getElementById("semi-final-t1");
  let player2 = document.getElementById("semi-final-t2");
  let player3 = document.getElementById("semi-final-t3");
  let player4 = document.getElementById("semi-final-t4");

  if (player1 && round[0]) showOnePlayer(player1, round[0][0]);
  if (player2 && round[0]) showOnePlayer(player2, round[0][1]);
  if (player3 && round[1]) showOnePlayer(player3, round[1][0]);
  if (player4 && round[1]) showOnePlayer(player4, round[1][1]);
}

function displayFinals(round) {
  let player1 = document.getElementById("final-t1");
  let player2 = document.getElementById("final-t2");
  showOnePlayer(player1, round[0][1]);
  showOnePlayer(player2, round[0][0]);
}
