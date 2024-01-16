
function tournamentBody(){
	return(`
	<h1>Hi this is your tournament</h1>
	<div class="container text-center"></div>
	<table>
		<tbody></tbody>
	</table>
	<button class="btn btn-primary" type="button id="launch-tournamet" onclick="startTournament()">Launch Tournament</button>
	<section class="bracket">
		<div class="round">
			<h3>Quarterfinals</h3>

			<div id="Team1">
				<div class="container text-center"></div>
			</div>
		</div>

		<div class="row">
			<div class="col">
				<p class="team-name" id="quarter-final-t1">Team1</p>
				Vs
				<p class="team-name" id="quarter-final-t2">Team2</p>
			</div>
			<div class="col">
				<p class="team-name" id="quarter-final-t3">Team3</p>
				Vs
				<p class="team-name" id="quarter-final-t4">Team4</p>
			</div>
			<div class="col">
				<p class="team-name" id="quarter-final-t5">Team5</p>
				Vs
				<p class="team-name" id="quarter-final-t6">Team6</p>
			</div>
			<div class="col">
				<p class="team-name" id="quarter-final-t7">Team7</p>
				Vs
				<p class="team-name" id="quarter-final-t8">Team8</p>
			</div>
		</div>

		<div class="round">
			<h3>Semifinals</h3>
		</div>
		<div class="row">
			<div class="col">
				<p class="team-name" id="semi-final-t1">Team1</p>
				Vs
				<p class="team-name" id="semi-final-t2">Team2</p>
			</div>
			<div class="col">
				<p class="team-name" id="semi-final-t3">Team3</p>
				Vs
				<p class="team-name" id="semi-final-t4">Team4</p>
			</div>
		</div>
		<div class="round">
			<h3>Finals</h3>
		</div>
		<div class="row">
			<div class="col">
				<p class="team-name" id="final-t1">Team1</p>
				Vs
				<p class="team-name" id="final-t2">Team2</p>
			</div>
		</div>
		<div class="round">
			<h3>Winner</h3>
		</div>
		<div class="row">
			<div class="team-name" class="col" id="winner">Winner place holder</div>
		</div>
	</section>
	`);
}