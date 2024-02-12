// Get the switch element
var toggleSwitch = document.getElementById("toggle2FA");
var mfa = document.getElementById("MFAModal");
var otp = document.getElementById("otpModal");
var MFAModal = new bootstrap.Modal(mfa || null);
var OTPModal = new bootstrap.Modal(otp || null);
init2FAButton();

async function init2FAButton() {
	try {
		const response = await fetch("https://localhost:443/api/mfaState/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		const result = await response.json();
		toggleSwitch.checked = result.mfa === "enabled";
	} catch (error) {
		timedAlert(
			`${await getTranslation("error getting 2fa")}: ${error}`,
			"warning"
		);
	}
}

// Listen for changes on the switch
toggleSwitch.addEventListener("change", function () {
	// Determine the new state
	is2FAEnabled = this.checked;

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
		const response = await fetch("https://localhost:443/api/set_2fa/", {
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
		OTPModal.show();
	} catch (error) {
		timedAlert(`Error: ${error}`);
		MFAModal.hide();
	}
}

async function verifyOTP() {
	try {
		const otp = document.getElementById("otp").value;
		const email = document.getElementById("email").value;
		console.log("the email is ", email);
		if (await sendEnable2faEmail(otp, email)) {
			toggleSwitch.checked = true;
			timedAlert("2fa enabled", "success");
		} else {
			timedAlert("Invalid OTP", "warning");

			return;
		}
		OTPModal.hide();
	} catch (error) {
		timedAlert(`Error: ${error}`, "warning");
		OTPModal.hide();
	}
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
	const response = await fetch("https://localhost:443/api/enable_2fa_email/", {
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
	const response = await fetch("https://localhost:443/api/submit_2fa_email/", {
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
