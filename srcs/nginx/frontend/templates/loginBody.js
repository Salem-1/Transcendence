function loginBody() {
	return `
		<img id="logo" src="/assets/logo1.png" alt="" onclick="callRoute('/')" />
		<form action="javascript:;" onsubmit="login()">
			<div id="logindiv">
				<img id="Person" src="/assets/Person.png" alt="Character" />
				<div class="form-floating mb-3">
					<input
						type="text"
						class="form-control"
						name="username"
						id="username"
						required
						placeholder="Username"
						data-i18n="username"
						autocomplete="username"
						maxlength="12"
					/>
					<label for="username" data-i18n="username"></label>
				</div>
				<div class="form-floating mb-3">
					<input
						type="password"
						class="form-control"
						id="password"
						name="password"
						required
						placeholder="Password"
						data-i18n="password"
						autocomplete="current-password"
						maxlength="35"
					/>
					<label for="password" data-i18n="password"></label>
				</div>
				<input type="submit" hidden />
				<div id="login" onclick="login()">
					<div class="button-div-one" style="background: #c7a940"></div>
					<div
						id="yellow"
						class="button-div-two"
						style="
							background: linear-gradient(
								180deg,
								#eda800 0%,
								#ffbb0b 100%
							);
						"
					></div>
					<div class="button-div-three">
						<h1 class="button-text" data-i18n="login">LOGIN</h1>
					</div>
				</div>
			</div>
		</form>
		<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true">
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
								autocomplete="otp"
								maxlength="6"
								
							/>
							<label for="otp" data-i18n="otp"></label>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-i18n="close" data-bs-dismiss="modal">Close</button>
						<button type="button" class="btn btn-info" data=i18n="resend" id="resendOtp">resend otp</button>
						<button type="button" class="btn btn-primary" data-i18n="verify" id="otpSubmit">Verify</button>
					</div>
				</div>
			</div>
		</div>
	`;
}
