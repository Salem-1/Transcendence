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

	if (!await isValidRegeistrationIput(username, password, confirmPassword)) return;
	try {
		await tryRegisterUser(username, password);
	} catch (error) {
		console.log(`${await getTranslation("reg failed")}: ${error}`);
	}
}

async function login() {
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	if (!await isValidLoginIput(username, password)) return;
	try {
		await tryLoginUser(username, password);
	} catch (error) {
		console.error("Error during registration:", error);
		alert(`${await getTranslation("reg failed")}: ${error}`);
	}
}

async function double_factor_authenticate(result) {
	await storeJWTInCookies(result);
	const otp = prompt(
		await getTranslation("enter otp"),
		"000000"
	);
	const otpPattern = /^\d{6}$/;
	if (otpPattern.test(otp)) {
		try {
			await try2FactorAuthentication(otp);
		} catch (error) {
			console.log("Error during registration:", error);
			alert(`${await getTranslation("reg failed")}: ${error}`);
		}
	} else {
		alert(`${await getTranslation("inavlid otp")}`);
	}
}
async function tryLoginUser(username, password){
	const response = await fetch("http://localhost:8000/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const result = await response.json();

	if (response.status == 200 && result.jwt_token) {
		await storeJWTInCookies(result);
		alert(`${await getTranslation("login success")}, ${await getTranslation("welcome")} ${username}.`);
		callRoute("/home");
	} else if (response.status == 302 && result.type == "otp") {
		double_factor_authenticate(result);
	} else {
		alert(`${await getTranslation("login failed")}: ${result.error}`);
	}
}

async function fetchAuthRedirection(){
	const response = await fetch("http://localhost:8000/redirect_uri/", {
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

async function tryRegisterUser(username, password){
	console.log(username)
	console.log(password)
	const response = await fetch("http://localhost:8000/register/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const result = await response.json();

	if (response.ok) {
		alert(await getTranslation("reg success"));
		callRoute("/login");
	} else {
		alert(`${await getTranslation("reg failed")}: ${result.error}`);
	}
}

async function isValidRegeistrationIput(username, password, confirmPassword) {
	if (username.length < 3 || username.length > 20)
		alert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid username length")}`);
	else if (password.length < 8 || password.length > 35)
		alert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid password length")}`);
	else if (/[ !@#$%^&*(),.;?":{}|<>' ]/.test(username))
		alert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid username char")}`);
	else if (
		!(
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/\d/.test(password)
		)
	) 
		alert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid password char")}`);
		else if (password !== confirmPassword)
		alert(`${await getTranslation("reg failed")}: ${await getTranslation("invalid password match")}`);
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
		alert(`${await getTranslation("invalid login")}`);
		return false;
	} else if (
		!(
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/\d/.test(password)
		)
	) {
		alert(`${await getTranslation("invalid login")}`);
		return false;
	}
	return true;
}

async function storeJWTInCookies(result) {
	// Assuming 'response' is your fetch response
	//extract "jwt_token" from response body
	const jwt_token = result.jwt_token;
	if (!jwt_token) return false;
	document.cookie = `Authorization=Bearer ${jwt_token}; Secure; SameSite=Strict`;
	return true;
}

function addJWTToRrequest() {
	const token = localStorage.getItem("jwtToken");
	fetch("/some-protected-endpoint", {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
}



async function try2FactorAuthentication(otp){
	const response = await fetch(
		"http://localhost:8000/double_factor_auth/",
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
		alert(`${await getTranslation("login success")}`);
		callRoute("/home");
	} else {
		alert(`${await getTranslation("inavlid otp")}`);
	}

}