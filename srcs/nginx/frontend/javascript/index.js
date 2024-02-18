// Get oauth link from auth service
async function oauthRedirect() {
	try {
		await fetchAuthRedirection();
	} catch (error) {
		console.log("Error during oauth redirect:", error);
	}
}

async function register() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("confirmpassword").value;

	if (!(await isValidRegeistrationIput(username, password, confirmPassword)))
		return;
	try {
		await tryRegisterUser(username, password);
	} catch (error) {
		console.log(`${await getTranslation("reg failed")}: ${error}`);
	}
}

async function login() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	if (!(await isValidLoginIput(username, password))) return;
	try {
		await tryLoginUser(username, password);
	} catch (error) {
		console.error("Error during registration:", error);
		timedAlert(`${await getTranslation("login failed")}`);
	}
}

async function tryLoginUser(username, password) {
	const response = await fetch(`${window.location.origin}/api/login/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const result = await response.json();

	if (response.status == 200 && result.jwt_token) {
		await storeJWTInCookies(result);
		timedAlert(
			`${await getTranslation("login success")}, ${await getTranslation(
				"welcome"
			)} ${username}.`,
			"success"
		);
		callRoute("/home");
	} else if (response.status == 302 && result.type == "otp") {
		double_factor_authenticate(result);
	} else {
		timedAlert(`${await getTranslation("login failed")}:`);
	}
}

async function fetchAuthRedirection() {
	const response = await fetch(`${window.location.origin}/api/redirect_uri/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const result = await response.json();
	if (response.ok) {
		window.location.href = result.oauth_link;
	} else {
		console.log(`Failed to get oauth link: ${result.error}`);
	}
}

function regLang() {
	return localStorage.getItem("language") || "en";
}

async function tryRegisterUser(username, password) {
	let language = regLang();
	const response = await fetch(`${window.location.origin}/api/register/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password, language}),
	});

	const result = await response.json();

	if (response.ok) {
		timedAlert(await getTranslation("reg success"), "success");
		callRoute("/login");
	} else {
		timedAlert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid username exists")}`);
	}
}

async function isValidRegeistrationIput(username, password, confirmPassword) {
	if (username.length < 3 || username.length > 20)
		timedAlert(
			`${await getTranslation("reg failed")}: ${await getTranslation(
				"invalid username length"
			)}`
		);
	else if (password.length < 8 || password.length > 35)
		timedAlert(
			`${await getTranslation("reg failed")}: ${await getTranslation(
				"invalid password length"
			)}`
		);
	else if (/[ !@#$%^&*(),.;?":{}|<>' ]/.test(username))
		timedAlert(
			`${await getTranslation("reg failed")}: ${await getTranslation(
				"invalid username char"
			)}`
		);
	else if (
		!(
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/\d/.test(password)
		)
	)
		timedAlert(
			`${await getTranslation("reg failed")}: ${await getTranslation(
				"invalid password char"
			)}`
		);
	else if (password !== confirmPassword)
		timedAlert(
			`${await getTranslation("reg failed")}: ${await getTranslation(
				"invalid password match"
			)}`
		);
	else return true;
	return false;
}

async function isValidLoginIput(username, password) {
	if (
		!(
			username.length > 1 &&
			username.length < 20 &&
			password.length > 7 &&
			password.length < 35 &&
			!/[ !@#$%^&*(),.;?":{}|<>' ]/.test(username)
		)
	) {
		timedAlert(`${await getTranslation("invalid login")}`);
		return false;
	} else if (
		!(
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/\d/.test(password)
		)
	) {
		timedAlert(`${await getTranslation("invalid login")}`);
		return false;
	}
	return true;
}
