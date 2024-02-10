// Get the switch element
var toggleSwitch = document.getElementById("toggle2FA");
var mfa = document.getElementById("MFAModal");
var MFAModal = new bootstrap.Modal(mfa || null);

init2FAButton();

// Get the current 2fa state
async function get2FAState() {
	try {
		const response = await fetch("http://localhost:8000/api/mfaState/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		const result = await response.json();
		return result.mfa === "enabled";
	} catch (error) {
		console.log("getting 2fa state failed", error);
	}
}

async function init2FAButton() {
	try {
		toggleSwitch.checked = await get2FAState();
	} catch (error) {
		console.log("getting 2fa state failed", error);
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
	} else {
		disable2FA();
	}
});

async function disable2FA() {
	try {
		const enable2fa = "false";
		const response = await fetch("http://localhost:8000/set_2fa/", {
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
			`${await getTranslation("error 2fa disable")}: ${error}`,
			"warning"
		);
	}
}

async function verifyEmail() {
	try {
		var otp = document.getElementById("otpModal");
		var OTPModal = new bootstrap.Modal(otp || null);
		var email = document.getElementById("email").value;

		if (!email || notValidEmail(email))
			timedAlert(await getTranslation("invalid email"), "warning");
		if (!(await submit2FaEmail(email)))
			timedAlert(await getTranslation("invalid email"), "warning");
		
		MFAModal.hide();
		OTPModal.show();
		
		let resend_counter = 0;
		const max_resend = 2;
		otp.addEventListener("click", async (event) => {
				console.log("event.target.id", event.target.id);
				if (event.target.id === "otpSubmit") {
					event.preventDefault();
					const otp = document.getElementById("otp").value;
					if (await verifyOTP(otp, email)) OTPModal.hide();
				} else if (event.target.id === "resendOtp") {
					resend_counter += 1;
					if (resend_counter > max_resend)
					{
						event.target.disabled = true;
						timedAlert(await getTranslation("max resend"))
						setTimeout(() => {
							resend_counter = 0;
							event.target.disabled = false;
						}, 6000);
					}
					if (await submit2FaEmail(email))
						timedAlert(await getTranslation("email sent"), "info");
					else
						timedAlert(
							await getTranslation("invalid email"),
							"warning"
						);
				}
			});
	} catch (error) {
		console.log(`Error: ${error}`);
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
		console.log(`Error: ${error}`);
	}
	return false;
}

async function sendEnable2faEmail(otp, email) {
	const response = await fetch("http://localhost:8000/enable_2fa_email/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ otp, email }),
	});
	await response.json();
	if (response.ok) return true;
	else return false;
}
async function submit2FaEmail(email) {
	const response = await fetch("http://localhost:8000/submit_2fa_email/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ email }),
	});
	await response.json();
	if (response.status == 202) return true;
	return false;
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
