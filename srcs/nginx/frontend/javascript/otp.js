const { get } = require("selenium-webdriver/http");

var login_max_resend = 3;
var login_resend_counter = 0;

async function storeJWTInCookies(result) {
	// Assuming 'response' is your fetch response
	//extract "jwt_token" from response body
	const jwt_token = result.jwt_token;
	if (!jwt_token) return false;
	document.cookie = `Authorization=Bearer ${jwt_token}; Secure; SameSite=Strict`;
	return true;
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
		if (await try2FactorAuthentication(otp)) {
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
		} else if (!(await resendOtp())) {
			modal.hide();
			if (window.location.pathname.includes("/auth"));
			callRoute("/");
		}
	}
}

async function double_factor_authenticate(result) {
	let tempLoginModal = document.getElementById("loginModal");
	if (!tempLoginModal)
	{
		timedAlert(await getTranslation("login failed"));
		callRoute("/")
		return;
	}
	let loginModal = new bootstrap.Modal(tempLoginModal);
	await storeJWTInCookies(result);
	loginModal.show();

	tempLoginModal.addEventListener("click", otpModalHandler);
	tempLoginModal.addEventListener("hidden.bs.modal", function (e) {
		tempLoginModal.removeEventListener("click", otpModalHandler);
	});
}
