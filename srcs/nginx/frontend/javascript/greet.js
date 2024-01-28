greetUser();

async function greetUser() {
	const greetElement = document.getElementById("greet");
	if (!greetElement) return;
	try {
		const response = await fetch("http://localhost:8000/username/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (response.ok) {
			const responseData = await response.json();
			const username = responseData.username;
			greetElement.textContent = `Hello ${username}`;
		} else if (response.status === 401) {
			const errorData = await response.json();
			alert(`${await getTranslation("error")}: ${errorData.error}`);
		} else alert(`${await getTranslation("error")}: ${response.status}`);
	} catch (error) {
		alert(`${await getTranslation("error username")}: ${error}`);
	}
}

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
			alert(`${await getTranslation("2fa disabled")}`)
		} else {
			alert(`${await getTranslation("error 2fa disable")}`)
		}
	} catch (error) {
		alert(`${await getTranslation("error 2fa disable")}: ${error}`)
	}
}

async function enable2FA() {
	try {
		const email = prompt("Please enter your email!");
		if (notValidEmail(email))
			throw new Error("Please enter a valid email address.");
		if (!(await submit2FaEmail(email)))
			throw new Error("Failed to submit email");
		const otp = prompt(
			"Enter 6 digits OTP from your authenticator app:",
			"000000"
		);
		const otpPattern = /^\d{6}$/;
		if (!otpPattern.test(otp)) throw new Error("Invalid OTP!");
		if (await sendEnable2faEmail(otp, email)) alert(await getTranslation("2fa enabled"));
		else throw new Error("Invalid OTP");
	} catch (error) {
		console.log("Failed to enable 2fa:", error);
		alert(`${await getTranslation("error 2fa enable")}: ${error}`);
	}
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
