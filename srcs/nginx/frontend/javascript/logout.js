async function logout() {
	try {
		await tryLogoutuser();
	} catch (error) {
		timedAlert(`${error}`);
	}
	return;
}

async function tryLogoutuser() {
	const response = await fetch(`${window.location.origin}/api/logout/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	if (response.ok) {
		// clear all cookies
		document.cookie.split(";").forEach(function (c) {
			document.cookie = c
				.replace(/^ +/, "")
				.replace(
					/=.*/,
					"=;expires=" + new Date().toUTCString() + ";path=/"
				);
		});
		callRoute("/");
		return;
	}
	timedAlert(`${await getTranslation("logout failed")}: ${error}`);
}
