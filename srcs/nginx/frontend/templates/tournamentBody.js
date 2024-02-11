
function tournamentBody(){
	return(`
	<div class="hero">
			<div id="content">
				<div class="top-bar">
					<img id="logo" src="assets/logo1.png" alt="" onclick="callRoute('/home')">
					<div class="drp">
					<div id="greet" onclick="myFunction()"></div>
						<div class="dropdown-content" id="myDropdown">
							<div class="drrp">
								<a class="button-text" onclick="callRoute('/settings')">SETTINGS</a>
								<hr>
								<a class="button-text" onclick="logout()">LOG OUT</a>
							</div>
						</div>
					</div>
				</div>
				 <header class="hero1">
					<div class="hero1-wrap">
					 <p class="intro" id="intro">42 ABU DHABI</p>
					 <h1 id="headline">Tournament</h1>
					 <p class="year"><i class="fa fa-star"></i> 2024 <i class="fa fa-star"></i></p>
					 <p>TAKE A CHILL PILL</p>
				   </div>
				  </header>
				  <section id="bracket">
					<div class="container">

					<div class="split split-one">

					  <div class="round round-one current">
						<div class="round-details">QUARTER FINALS - 1<br/></div>
						<ul class="matchup">
						  <li class="team team-top" id="quarter-final-t1">Team 1</li>
						  <li class="team team-bottom" id="quarter-final-t2">Team 2</li>
						</ul>
						<ul class="matchup">
						  <li class="team team-top" id="quarter-final-t3">Team 3</li>
						  <li class="team team-bottom" id="quarter-final-t4">Team 4</li>
						</ul>
					  </div>  
					  <!-- END ROUND ONE -->
				  
					  <div class="round round-two current">
						<div class="round-details">SEMI FINALS - 1<br/></div>     
						<ul class="matchup">
						  <li class="team team-top" id="semi-final-t1">Team 1</li>
						  <li class="team team-bottom" id="semi-final-t2">Team 2</li>
						</ul> 
					  </div>  
					  <!-- END ROUND TWO -->
					  
					  <div class="round round-three current">
						<div class="round-details">FINALS<br/></div>     
						<ul class="matchup">
						  <li class="team team-top" id="final-t2">Team 2</li>
						</ul> 
					  </div>  
					  <!-- END ROUND THREE -->    
					</div> 
				  
				  <div class="champion current">
					  <div class="final">
						<i class="fa fa-trophy"></i>
						<div class="round-details">WINNER <br/></div>    
						<ul class ="matchup championship">
						  <li class="team team-top" id="winner">Winner place holder</li>
						</ul>
					  </div>
					</div>

					<div class="split split-two current">
					  <div class="round round-three">
						<div class="round-details">FINALS<br/></div>           
						<ul class="matchup">
						  <li class="team team-top" id="final-t1">Team 1</li>
						</ul> 
					  </div>  
					  <!-- END ROUND THREE -->  
				  
					  <div class="round round-two current">
						<div class="round-details">SEMI FINALS - 2</div>           
						<ul class="matchup">
						  <li class="team team-top" id="semi-final-t3">Team3</li>
						  <li class="team team-bottom" id="semi-final-t4">Team4	</li>
						</ul> 
					  </div>  
					  <!-- END ROUND TWO -->
					  <div class="round round-one current">
 						<div class="round-details">QUARTER FINALS - 2<br/></div>
						<ul class="matchup">
						  <li class="team team-top" id="quarter-final-t5">Team 5</li>
						  <li class="team team-bottom" id="quarter-final-t6">Team 6</li>
						</ul>
						<ul class="matchup">
						  <li class="team team-top" id="quarter-final-t7">Team 7</li>
						  <li class="team team-bottom" id="quarter-final-t8">Team 8</li>
						</ul>
					  </div>  
					  <!-- END ROUND ONE -->                  
					</div>
					</div>
					<button class="btn btn-warning" type="button" id="launch-tournamet" onclick="startTournament()">LAUNCH TOURNAMENT</button>
					<button class="btn btn-dark" type="button" id="menu"  onclick="callRoute('/home')">MAIN MENU</button>

					</section>

	`);
}