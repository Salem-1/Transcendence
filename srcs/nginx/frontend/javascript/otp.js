
var login_max_resend = 3;
var login_resend_counter = 0;

async function storeJWTInCookies(result) {
	const jwt_token = result.jwt_token;
	if (!jwt_token)
		return false;
	document.cookie = `Authorization=Bearer ${jwt_token}; Secure; SameSite=Strict`;
	return true;
}

async function try2FactorAuthentication(otp) {
	try{
		const response = await fetch(
			`${window.location.origin}/api/double_factor_auth/`,
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
		} else 
		{
			if (result.error === "Invalid OTP")
			{
				timedAlert(`${await getTranslation("invalid otp")}`);
				return false;
			}
			if (window.location.pathname.includes("/auth"))
				callRoute("/");
			timedAlert(`${await getTranslation("login failed")}`);
			return true;
		}
		return false;
	}
	catch (e){
		return (false);
	}
}

async function resendOtp() {
	try {
	const response = await fetch(`${window.location.origin}/api/resendOtp/`, {
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
	catch (e){
		return (false);
	}
}

async function modalEnterHandler(event) {
	if (event.key === "Enter") {
		document.getElementById("otpSubmit").click();
	}
}

async function otpModalHandler(event) {
	let otpInput = document.getElementById("otp");
	let loginModal = document.getElementById("loginModal");
	let modal = bootstrap.Modal.getOrCreateInstance(loginModal);
	if (event.target.id === "otpSubmit") {
		event.preventDefault();
		const otp = document.getElementById("otp").value;
		const otpPattern = /^\d{6}$/;
		if (!otpPattern.test(otp)) {
			timedAlert(await getTranslation("invalid otp"), "warning");
			otpInput.value = "";
			otpInput.focus();
		}
		else if (await try2FactorAuthentication(otp)) {
			login_resend_counter = 0;
			modal.hide();
		} else {
			otpInput.value = "";
			otpInput.focus();
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
		} else {
			otpInput.value = "";
			otpInput.focus();
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
	let loginModal = bootstrap.Modal.getOrCreateInstance(tempLoginModal);
	await storeJWTInCookies(result);
	loginModal.show();
	loginModal._element.addEventListener('shown.bs.modal', function () {
		document.getElementById("otp").value = "";
		document.getElementById("otp").focus();
	});

	window.addEventListener('popstate', function () {
		loginModal.hide();
		window.removeEventListener('popstate', function () {
			loginModal.hide();
		});
	});

	tempLoginModal.addEventListener("keydown", modalEnterHandler);
	tempLoginModal.addEventListener("click", otpModalHandler);
	tempLoginModal.addEventListener("hidden.bs.modal", function (e) {
		tempLoginModal.removeEventListener("click", otpModalHandler);
		tempLoginModal.removeEventListener("keydown", modalEnterHandler);
		if (window.location.pathname.includes("/auth"))
			callRoute("/");
	});
}
