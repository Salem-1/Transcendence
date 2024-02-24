function settingsBody() {
	return `
	
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
			<a  class="button-text" >
				<div class="form-check form-switch form-check-reverse">
					<input class="form-check-input" type="checkbox" id="toggle2FA" />
					<label class="form-check-label" for="toggle2FA" data-i18n="enable 2FA"></label>
				</div>
			</a>
			<hr>
			<div class="dropdown-center">
			<a class="button-text dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-i18n="language">
			</a>
		  
			<ul class="dropdown-menu dropdown-menu-dark">
				<li class="dropdown-item"  onclick="changeLanguage('en')" >
						<img
							src="assets/gb.svg"
							alt="English"
							width="30"
							height="24"
						/>
						English
				</li>
				<li><hr class="dropdown-divider"></li>
				<li class="dropdown-item"  onclick="changeLanguage('es')" >
						<img
							src="assets/es.svg"
							alt="Español"
							width="30"
							height="24"
						/>
						Español
				</li>
				<li><hr class="dropdown-divider"></li>
				<li class="dropdown-item"  onclick="changeLanguage('pt')" >
						<img
							src="assets/pt.svg"
							alt="Português"
							width="30"
							height="24"
						/>
						Português
				</li>
				<li><hr class="dropdown-divider"></li>
				<li class="dropdown-item"  onclick="changeLanguage('ar')" >
						<img
							src="assets/eg.svg"
							alt="العربية"
							width="30"
							height="24"
						/>
						العربية
				</li>
			</ul>
			</a>
			</div>
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
							autoFocus
							required
							placeholder="email"
							autocomplete="email"
							maxlength="80"
						/>
						<label for="email" data-i18n="email"></label>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-i18n="close" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-primary" data-i18n="enable" type="submit" onclick="verifyEmail()">Enable</button>
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
							type="text"
							class="form-control"
							name="otp"
							id="otp"
							required
							placeholder="otp"
							data-i18n="otp"
							autocomplete="otp"
							maxlength="6"
						/>
						<label for="otp" data-i18n="otp"></label>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-i18n="close" data-bs-dismiss="modal">Close</button>
					<button type="button" class="btn btn-info" data-i18n="resend" id="resendOtp">resend otp</button>
					<button type="button" class="btn btn-primary" type="submit" data-i18n="enable" id="otpSubmit">Enable</button>
				</div>
			</div>
		</div>
	</div>
	`;
}
