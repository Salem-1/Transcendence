function homePageBody(){
	return (`

		<!-- <h1>You are logged in ya basha</h1> -->
		<!-- <h1 id="greet">hsdfsdfged User</h1> -->
		<button type="button" onclick="enable2FA()">Enable 2FA</button>
		<button type="button" onclick="disable2FA()">Disable2 FA</button>
			<div class="top-bar">
				<img id="logo" src="assets/logo1.png" alt="">
				<div class="drp">
					<img id="Person" src="assets/Person.png" alt="Character" onclick="myFunction()">
					<div class="dropdown-content" id="myDropdown">
						<div class="drrp">
							<a class="button-text" href="#">PROFILE</a>
							<hr>
							<a class="button-text" href="#">SETTINGS</a>
							<hr>
							<a class="button-text" onclick="logout()">LOG OUT</a>
						</div>
					</div>
				</div>
			</div>
			<div class="btns">
				<div class="buttons">
					<div id="single-player" onclick="callRoute('/game')">
						<div class="button-div-one" style="	background: #c7a940"></div>
						<div id="yellow" class="button-div-two" style="background: linear-gradient( 180deg, #eda800 0%, #ffbb0b 100%);"></div>
						<div class="button-div-three"><h1 class="button-text">SINGLE PLAYER</h1></div>
					</div>
				</div>
				<div class="buttons">
					<div id="start_tournament">
						<div class="button-div-one" style="background: #82764D;"></div>
						<div id="black" class="button-div-two" style="background: linear-gradient(180deg, #524040 0%, #070706 100%);"></div>
						<div class="button-div-three"><h1 class="button-text">TOURNAMENT</h1></div>
					</div>
				</div>
				<div id="myModal" class="modal">
					<div class="modal-content">
						<div class="head">
							<div class="heading">
								<h1 class="heading-text">Tournament Players</h1>
							</div>
							<div id="close-btn" class="close">
								<div class="button-div-one" style="	background: #F01E1E; width:60px; height: 50px;"></div>
								<div id="red-btn" class="button-div-two" style="width:50px; height:45px; background: linear-gradient(180deg, #FF2C17 0%, #FF5353 100%);"></div>
								<div class="button-div-three" style="width: 50px; height: 25px;"><h1 class="button-text" style="font-size: 25px; line-height: 15px;">X</h1></div>
							</div>
						</div>
						<div class="player-table">
							<table>
								<form action="javascript:;" onsubmit="addPlayer()">
									<thead>
										<tr>
											<th>
												<input type="text" id="player-name" name="player-name" required placeholder="Player Name" maxlength="14">
											</th>
											<th>
												<div id="add-player" onclick="addPlayer()">
													<div class="add-button-div-one" style="background: #C7A940;"></div>
													<div id="add-yellow" class="add-button-div-two" style="background: linear-gradient(180deg, #EDA800 0%, #FFBB0B 100%);"></div>
													<div class="add-button-div-three"><h1 class="add-button-text">ADD</h1></div>
												</div>
											</th>
										</tr>
									</thead>
								</form>
								<tbody></tbody>
							</table>
							<div id="launch-tournamet" onclick="launchTournament()">
								<div class="tour-button-div-one" style="background: #82764D;"></div>
								<div id="black" class="tour-button-div-two" style="background: linear-gradient(180deg, #524040 0%, #070706 100%);"></div>
								<div class="tour-button-div-three"><h1 class="tour-button-text">START</h1></div>
							</div>
						</div>
					</div>
				</div>
				<div class="quote">
					<h1 id="quote-text">Quote: When someone says “Expect the 
					Unexpected” slap them and say : “You
					didn't expect that, did you?”</h1>
				</div>
			</div>
		<!-- <button type="button" onclick="callRoute('/game')">Play game</button> -->


		`)
}