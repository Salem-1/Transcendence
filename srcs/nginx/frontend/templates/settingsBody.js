function settingsBody(){
	return (`
	
	<div class="top-bar">
		<img id="logo" src="assets/logo1.png" onclick="callRoute('/home')" alt="">
		<div class="drp">
			<img id="Person" src="assets/Person.png" alt="Character" onclick="myFunction()">
			<div class="dropdown-content" id="myDropdown">
				<div class="drrp">
					<a class="button-text" href="#" data-i18n="profile">PROFILE</a>
					<hr>
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
			<!-- <a class="button-text" onclick="disable2FA()" data-i18n="disable 2FA">DISABLE 2FA</a> -->
			<a class="button-text" data-bs-toggle="modal" data-bs-target="#MFAModal" data-i18n="disable 2FA">DISABLE 2FA</a>
			<hr>
			<a class="button-text" href="#" data-i18n="language" >LANGUAGE</a>
			<hr>
			<a class="button-text" onclick="logout()" data-i18n="logout">LOG OUT</a>
		</div>
	</div>
	<div class="modal fade" id="MFAModal" tabindex="-1" aria-labelledby="MFAModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="MFAModalLabel" data-i18n="2fa"></h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="form-floating mb-3" on>
						<input
							type="email"
							class="form-control"
							name="email"
							id="email"
							required
							placeholder="email"
							autocomplete="email"
							maxlength="20"
						/>
						<label for="email" data-i18n="email"></label>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" data-bs-target="#otpModal" data-bs-toggle="modal">Enable</button>
				</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="otpModalLabel" data-i18n="2fa"></h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<p data-i18n="enter otp"></p>
				<div class="modal-body">
					<div class="form-floating mb-3" on>
						<input
							type="number"
							class="form-control"
							name="otp"
							id="otp"
							required
							placeholder="otp"
							autocomplete="otp"
							maxlength="20"
						/>
						<label for="otp" data-i18n="otp"></label>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" onclick="enable2FA()">Enable</button>
				</div>
			</div>
		</div>
	</div>
	`)
}