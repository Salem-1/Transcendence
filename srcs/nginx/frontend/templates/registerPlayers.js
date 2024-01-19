function registerPlayers(){
	return (`
	<table>
		<thead>
		  <tr>
			<th>Player Name</th>
			<th>ADD</th>
		  </tr>
		</thead>
		<tbody>
		  <tr>
			<td><input type="text" id="player-name" maxlength="14"></td>
			<td><button type="button" id="add-player"  onclick="addPlayer()">ADD</button></td>
		  </tr>
		</tbody>
	</table>
	
	<button type="button" id="launch-tournamet" onclick="launchTournament()">Launch Tournament</button></td>
	`);
}