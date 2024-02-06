function settingsBody(){
	return (`
	
	<div class="top-bar">
		<img id="logo" src="assets/logo1.png" onclick="callRoute('/home')" alt="">
		<div class="drp">
			<div id="greet" onclick="myFunction()"></div>	
			<div class="dropdown-content" id="myDropdown">
				<div class="drrp">
					<a class="button-text" onclick="callRoute('/settings')" data-i18n="settings">SETTINGS</a>
					<hr>
					<a class="button-text" onclick="logout()" data-i18n="logout">LOG OUT</a>
				</div>
			</div>
		</div>
	</div>
	<div class="settings">
		<div class="ssettings">
			<a class="button-text" onclick="enable2FA()" data-i18n="enable 2FA">ENABLE 2FA</a>
			<hr>
			<a class="button-text" onclick="disable2FA()" data-i18n="disable 2FA">DISABLE 2FA</a>
			<hr>
			<a class="button-text" href="#" data-i18n="language" >LANGUAGE</a>
			<hr>
			<a class="button-text" onclick="logout()" data-i18n="logout">LOG OUT</a>
		</div>
	</div>
	`)
}