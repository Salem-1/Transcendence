//const { get } = require("selenium-webdriver/http");

intraAuthenticate();

async function intraAuthenticate() {
	let code = extractIntraAuthCode();

	try {
		if (code == null || code == "") {
			timedAlert(await getTranslation("reg or login failed"));
			throw new Error("Erro while intra authentication");
		}
		const controller = new AbortController();
		const signal = controller.signal;
		const timeout =  15000; // Timeout in milliseconds

setTimeout(() => controller.abort(), timeout);
		const response = await fetch("https://localhost:443/api/auth/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code }),
			signal,
		});

		const result = await response.json();
		if (response.status == 200 && result.jwt_token) {
			await storeJWTInCookies(result);
			callRoute("/home");
		} else if (response.status == 302 && result.type == "otp") {
			double_factor_authenticate(result);
		} else {
			timedAlert(
				`${await getTranslation("login failed")}: ${result.error}`
			);
		}
	} catch (error) {
		console.log("Error during registration:", error);
		timedAlert(`${await getTranslation("reg failed")}: ${error}`);
		callRoute("/");
	}
}

function extractIntraAuthCode() {
	//nginx is blocking this
	const currentUrl = window.location.href;
	const url = new URL(currentUrl);
	const codeValue = url.searchParams.get("code");
	return codeValue;
}

async function storeJWTInCookies(result) {
	// Assuming 'response' is your fetch response
	//extract "jwt_token" from response body
	const jwt_token = result.jwt_token;
	if (!jwt_token) return false;
	document.cookie = `Authorization=Bearer ${jwt_token}; Secure; SameSite=Strict`;
	return true;
}

async function try2FactorAuthentication(otp) {
	try {
		const response = await fetch("https://localhost:443/api/double_factor_auth/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ otp }),
			credentials: "include",
		});

		const result = await response.json();

		if (response.ok) {
			await storeJWTInCookies(result);
			timedAlert(await getTranslation("login success"), "success");
			callRoute("/home");
		} else {
			timedAlert(await getTranslation("inavlid otp"));
		}
	} catch (error) {
		timedAlert(`${await getTranslation("reg failed")}: ${result.error}`);
	}
}

async function double_factor_authenticate(result) {
	await storeJWTInCookies(result);
	const modal = new bootstrap.Modal(document.getElementById('otpModal'));
	modal.show();
	document.getElementById('otpModal').addEventListener('click', async (event) => {
		if (event.target.id === 'otpSubmit')
		{
			event.preventDefault();
			const otp = document.getElementById('otp').value;
			await try2FactorAuthentication(otp);
		}
		modal.hide();
	});
}
