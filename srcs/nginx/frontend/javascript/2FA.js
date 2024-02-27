// Get the switch element
var toggleSwitch = document.getElementById("toggle2FA");
var mfa = document.getElementById("MFAModal");
var otp = document.getElementById("otpModal");
var OTPModal = bootstrap.Modal.getOrCreateInstance(otp || null);
var MFAModal = bootstrap.Modal.getOrCreateInstance(mfa || null);
var email = "";
var max_resend = 3;
var resend_counter = 0;

document.getElementById("MFAModal").addEventListener("keydown", function (e) {
	if (e.key === "Enter") verifyEmail();
});

init2FAButton();
// Get the current 2fa state
async function get2FAState() {
	try {
		const response = await fetch(`${window.location.origin}/api/mfaState/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		const result = await response.json();
		return result.mfa === "enabled";
	} catch (error) {
		;
	}
}

async function init2FAButton() {
	try {
		toggleSwitch.checked = await get2FAState();
	} catch (error) {
		;
	}
}

// Listen for changes on the switch
toggleSwitch.addEventListener("change", async function () {
	// Determine the new statere
	is2FAEnabled = this.checked;
	// If the state is already the same, do nothing
	if ((await get2FAState()) === is2FAEnabled) return;
	// switch the 2fa state
	this.checked = !is2FAEnabled;
	if (is2FAEnabled) {
		MFAModal.show();
		document.getElementById("email").value = "";
		MFAModal._element.addEventListener('shown.bs.modal', function () {
			document.getElementById("email").focus();
		});
	} else {
		disable2FA();
	}
	window.addEventListener('popstate', function () {
		MFAModal.hide();
		window.removeEventListener('popstate', function () {
			MFAModal.hide();
		});
	});
});

async function disable2FA() {
	try {
		const enable2fa = "false";
		const response = await fetch(`${window.location.origin}/api/set_2fa/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ enable2fa }),
			credentials: "include",
		});

		await response.json();

		if (response.ok) {
			timedAlert(`${await getTranslation("2fa disabled")}`, "success");
			toggleSwitch.checked = false;
		} else {
			timedAlert(
				`${await getTranslation("error 2fa disable")}`,
				"warning"
			);
		}
	} catch (error) {
		timedAlert(
			`${await getTranslation("error 2fa disable")}`,
			"warning"
		);
	}
}

async function hadleOTPModal(event) {
	otpfield = document.getElementById("otp");
	if (event.target.id === "otpSubmit") {
		event.preventDefault();
		const otp = document.getElementById("otp").value;
		if (await verifyOTP(otp, email)) 
			OTPModal.hide();
		else
		{
			otpfield.value = "";
			otpfield.focus()
		}
	} else if (event.target.id === "resendOtp") {
		if (resend_counter++ < max_resend) {
			if (await submit2FaEmail(email))
				timedAlert(await getTranslation("email sent"), "info");
			else
				timedAlert(await getTranslation("invalid email"), "warning");
		} 
		else {
			let resend_button = event.target;
			resend_button.disabled = true;
			event.target.style.display = "none";
			timedAlert(await getTranslation("max resend"));
			setTimeout(() => {
				resend_counter = 0;
				resend_button.disabled = false;
				event.target.style.display = "block";
			}, 10000);
		}
		otpfield.value = "";
		otpfield.focus();
	}
}

async function handleOTPKeydown(event) {
	if (event.key === "Enter") (document.getElementById("otpSubmit")).click();
}

async function verifyEmail() {
	try {
		let emailInput = document.getElementById("email");
		email = emailInput.value;

		if (!email || notValidEmail(email) || !(await submit2FaEmail(email))) {
			timedAlert(await getTranslation("invalid email"), "warning");
			emailInput.focus();
			return;
		}

		MFAModal.hide();
		OTPModal.show();
		OTPModal._element.addEventListener('shown.bs.modal', function () {
			document.getElementById("otp").value = "";
			document.getElementById("otp").focus();
		});
		window.addEventListener('popstate', function () {
			OTPModal.hide();
			window.removeEventListener('popstate', function () {
				OTPModal.hide();
			});
		});

		otp.addEventListener("keydown", handleOTPKeydown);
		otp.addEventListener("click", hadleOTPModal);
		otp.addEventListener("hidden.bs.modal", function (e) {
			emailInput.value = "";
			otp.removeEventListener("click", hadleOTPModal);
			otp.removeEventListener("keydown", handleOTPKeydown);
		});
	} catch (error) {
		MFAModal.hide();
	}
}

async function verifyOTP(otp, email) {
	try {
		const otpPattern = /^\d{6}$/;
		if (!otpPattern.test(otp)) {
			timedAlert(await getTranslation("invalid otp"), "warning");
			return false;
		}
		if (await sendEnable2faEmail(otp, email)) {
			toggleSwitch.checked = true;
			timedAlert(await getTranslation("2fa enabled"), "success");
			return true;
		} else {
			timedAlert(await getTranslation("invalid otp"), "warning");
		}
	} catch (error) {
		;
	}
	return false;
}

async function sendEnable2faEmail(otp, email) {
	try{
		const response = await fetch(
			`${window.location.origin}/api/enable_2fa_email/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ otp, email }),
			}
		);
		await response.json();
		if (response.ok) return true;
		else 
			return false;
	}
	catch (e){
		return false;
	}
}
async function submit2FaEmail(email) {
	try{	
		const response = await fetch(
			`${window.location.origin}/api/submit_2fa_email/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ email }),
			}
		);
		await response.json();
		if (response.status == 202) return true;
		return false;
	}
	catch (e){
		return (false);
	}
}

function notValidEmail(email) {
	if (
		!email ||
		email.length < 5 ||
		email.length > 80 ||
		email.indexOf("@") < 1 ||
		email.indexOf(".") < 1 ||
		containsForbiddenchar(email) ||
		email.split("@").length - 1 > 1
	)
		return true;
	return false;
}

function containsForbiddenchar(email) {
	let forbidden_chars = [
		"'",
		'"',
		"\\",
		"#",
		"$",
		"%",
		"^",
		"&",
		"*",
		"(",
		")",
		"!",
	];

	return [...email].some((char) => forbidden_chars.includes(char));
}
