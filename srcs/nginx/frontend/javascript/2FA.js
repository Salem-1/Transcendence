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
	if (await get2FAState() === is2FAEnabled) return;
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

		const result = await response.json();

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
		var email = document.getElementById("email").value;
		if (!email || notValidEmail(email))
			timedAlert("Please enter a valid email address.", "warning");
		if (!(await submit2FaEmail(email)))
			timedAlert("Failed to submit email", "warning");
		MFAModal.hide();
		var otp = document.getElementById("otpModal");
		var OTPModal = new bootstrap.Modal(otp || null);
		OTPModal.show();

		document
			.getElementById("otpModal")
			.addEventListener("click", async (event) => {
				console.log("event.target.id", event.target.id);
				if (event.target.id === "otpSubmit") {
					event.preventDefault();
					const otp = document.getElementById("otp").value;
					if (await verifyOTP(otp, email)) OTPModal.hide();
				} else if (event.target.id === "resendOtp") {
					if (await submit2FaEmail(email))
						timedAlert("Email sent", "success");
					else timedAlert("Failed to submit email", "warning");
				}
			});
	} catch (error) {
		timedAlert(`Error: ${error}`);
		MFAModal.hide();
		OTPModal.hide();
	}
}

async function verifyOTP(otp, email) {
	try {
		const otpPattern = /^\d{6}$/;
		if (!otpPattern.test(otp)) {
			timedAlert("Invalid OTP", "warning");
			return false;
		}
		if (await sendEnable2faEmail(otp, email)) {
			toggleSwitch.checked = true;
			timedAlert("2fa enabled", "success");
			return true;
		} else {
			timedAlert("Invalid OTP", "warning");
		}
	} catch (error) {
		timedAlert(`Error: ${error}`, "warning");
	}
	return false;
}

// async function enable2FA() {
// 	try {
// 		var email = document.getElementById('email').value;
// 		console.log("the email is ", email);
// 		if (!email || notValidEmail(email))
// 			throw new Error("Please enter a valid email address.");
// 		if (!(await submit2FaEmail(email)))
// 			throw new Error("Failed to submit email");
// 		// return;
// 		const otp = prompt(await getTranslation("enter otp"), "000000");
// 		const otpPattern = /^\d{6}$/;
// 		if (!otpPattern.test(otp)) throw new Error("Invalid OTP!");
// 		if (await sendEnable2faEmail(otp, email))
// 			timedAlert(await getTranslation("2fa enabled"), "success");
// 		else throw new Error("Invalid OTP");
// 	} catch (error) {
// 		timedAlert(`${await getTranslation("error 2fa enable")}: ${error}`, "warning");
// 	}
// }

async function sendEnable2faEmail(otp, email) {
	const response = await fetch("http://localhost:8000/enable_2fa_email/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ otp, email }),
	});
	const result = await response.json();
	if (response.ok) return true;
	else throw new Error("Invalid otp");
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
	const result = await response.json();
	if (response.status == 202) return true;
	else
		throw new Error(
			"Couldn't submit email for double factor authentication"
		);
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
