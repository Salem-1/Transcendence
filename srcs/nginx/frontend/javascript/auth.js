//const { get } = require("selenium-webdriver/http");

intraAuthenticate();

async function intraAuthenticate() {
	let code = extractIntraAuthCode();

	try {
		if (code == null || code == "") {
			timedAlert(await getTranslation("reg or login failed"));
			throw new Error("Erro while intra authentication");
		}
		const response = await fetch("http://localhost:443/auth/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code }),
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
		console.error("Error during registration:", error);
		timedAlert(`${await getTranslation("reg failed")}: ${result.error}`);
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

async function double_factor_authenticate(result) {
	await storeJWTInCookies(result);
	const otp = prompt(await getTranslation("enter otp"), "000000");
	const otpPattern = /^\d{6}$/;
	if (otpPattern.test(otp)) {
		try {
			const response = await fetch(
				"http://localhost:443/double_factor_auth/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ otp }),
					credentials: "include",
				}
			);

			const result = await response.json();

			if (response.ok) {
				await storeJWTInCookies(result);
				timedAlert(await getTranslation("login success"), "success");
				callRoute("/home");
			} else {
				timedAlert(await getTranslation("inavlid otp"));
				callRoute("/");
			}
		} catch (error) {
			timedAlert(
				`${await getTranslation("reg failed")}: ${result.error}`
			);
		}
	} else {
		timedAlert(await getTranslation("inavlid otp"));
		callRoute("/");
	}
}
