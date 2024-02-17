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
		const response = await fetch(`${window.location.origin}/api/auth/`, {
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
				`${await getTranslation("login failed")}`
			);
		}
	} catch (error) {
		console.log("Error during registration:", error);
		timedAlert(`${await getTranslation("reg failed")}`);
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
