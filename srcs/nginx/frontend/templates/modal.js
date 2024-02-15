function genModal() {
  return `
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
						<button type="button" class="btn btn-info" data-i18n="resend" id="resendOtp">resend otp</button>
						<button type="button" class="btn btn-primary" data-i18n="verify" id="otpSubmit">Verify</button>
					</div>
				</div>
			</div>
		</div>
		`;
}