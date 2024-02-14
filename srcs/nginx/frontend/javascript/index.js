var login_max_resend = 3;
var login_resend_counter = 0;
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
		timedAlert(`${await getTranslation("reg failed")}: ${error}`);
	}
}

async function resendOtp() {
	const response = await fetch("https://localhost:443/api/resendOtp/", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	const result = await response.json();
	if (response.ok) {
		timedAlert(`${await getTranslation("email sent")}`, "success");
		return true;
	}
	timedAlert(`${await getTranslation("login failed")}`);
	return false;
}

async function otpModalHandler(event) {
	let loginModal = document.getElementById("loginModal");
	let modal = bootstrap.Modal.getInstance(loginModal);
	// let loginModal = new bootstrap.Modal(tempLoginModal || null);
	if (event.target.id === "otpSubmit") {
		event.preventDefault();
		const otp = document.getElementById("otp").value;
		if (await try2FactorAuthentication(otp)){
			login_resend_counter = 0;
			modal.hide();
		} 
	} else if (event.target.id === "resendOtp") {
		if (login_resend_counter++ >= login_max_resend) {
			resend_button = document.getElementById("resendOtp");
			event.target.disabled = true;
			resend_button.style.display = "none";
			timedAlert(await getTranslation("max resend"));
			setTimeout(() => {
				login_resend_counter = 0;
				event.target.disabled = false;
				resend_button.style.display = "block";
			}, 10000);
		} else if (!(await resendOtp())) modal.hide();
	}
}

async function double_factor_authenticate(result) {
	let tempLoginModal = document.getElementById("loginModal");
	let loginModal = new bootstrap.Modal(tempLoginModal || null);
	await storeJWTInCookies(result);
	loginModal.show();

	tempLoginModal.addEventListener("click", otpModalHandler);
	tempLoginModal.addEventListener("hidden.bs.modal", function (e) {
		tempLoginModal.removeEventListener("click", otpModalHandler);
	});

	// document
	// 	.getElementById("otpModal")
	// 	.addEventListener("click", async (event) => {
	// 		if (event.target.id === "otpSubmit") {
	// 			event.preventDefault();
	// 			const otp = document.getElementById("otp").value;
	// 			if (await try2FactorAuthentication(otp)) loginModal.hide();
	// 		} else if (event.target.id === "resendOtp") {
	// 			if (resend_counter++ >= max_resend) {
	// 				resend_button = document.getElementById("resendOtp");
	// 				event.target.disabled = true;
	// 				resend_button.style.display = "none";
	// 				timedAlert(await getTranslation("max resend"));
	// 				setTimeout(() => {
	// 					resend_counter = 0;
	// 					event.target.disabled = false;
	// 					resend_button.style.display = "block";
	// 				}, 10000);
	// 			} else if (!(await resendOtp()))
	// 				loginModal.hide();
	// 		}
	// 	});
}
async function tryLoginUser(username, password) {
	const response = await fetch("https://localhost:443/api/login/", {
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
		timedAlert(`${await getTranslation("login failed")}: ${result.error}`);
	}
}

async function fetchAuthRedirection() {
	const response = await fetch("https://localhost:443/api/redirect_uri/", {
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

async function tryRegisterUser(username, password) {
	const response = await fetch("https://localhost:443/api/register/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const result = await response.json();

	if (response.ok) {
		timedAlert(await getTranslation("reg success"), "success");
		callRoute("/login");
	} else {
		timedAlert(`${await getTranslation("reg failed")}: ${result.error}`);
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

async function try2FactorAuthentication(otp) {
	const response = await fetch(
		"https://localhost:443/api/double_factor_auth/",
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
		timedAlert(`${await getTranslation("login success")}`, "success");
		callRoute("/home");
		return true;
	} else timedAlert(`${await getTranslation("invalid otp")}`);
	return false;
}
