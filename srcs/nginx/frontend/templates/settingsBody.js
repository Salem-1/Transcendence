function settingsBody(){
	return (`
	
	<div class="top-bar">
		<img id="logo" src="assets/logo1.png" alt="">
		<div class="drp">
			<img id="Person" src="assets/Person.png" alt="Character" onclick="myFunction()">
			<div class="dropdown-content" id="myDropdown">
				<div class="drrp">
					<a class="button-text" href="#">PROFILE</a>
					<hr>
					<a class="button-text" onclick="callRoute('/settings')">SETTINGS</a>
					<hr>
					<a class="button-text" onclick="logout()">LOG OUT</a>
				</div>
			</div>
		</div>
	</div>
	<div class="settings">
		<div class="ssettings">
			<a class="button-text" onclick="enable2FA()">ENABLE 2FA</a>
			<hr>
			<a class="button-text" onclick="disable2FA()">DISABLE 2FA</a>
			<hr>
			<a class="button-text" href="#">LANGUAGE</a>
			<hr>
			<a class="button-text" onclick="logout()">LOG OUT</a>
		</div>
	</div>
	`)
}