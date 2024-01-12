greetUser();

async function greetUser() {
	const greetElement = document.getElementById("greet");
	if (!greetElement) return;
	try {
		// alert("sending request")
		const response = await fetch("http://localhost:8000/username/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Add this line
		});
		if (response.ok) {
			const responseData = await response.json();
			// alert(responseData);

			const username = responseData.username;
			alert("hello");
			greetElement.textContent = `Hello ${username}`;
		} else if (response.status === 401) {
			const errorData = await response.json();
			alert(`Error: ${errorData.error}`);
		} else alert(`Error: ${response.status}`);
	} catch (error) {
		alert("Error fetching username:", error);
	}
}

async function enable2FA() {
	try {
		const enable2fa = "true";
		const response = await fetch("http://localhost:8000/set_2fa/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ enable2fa }),
			credentials: "include",
		});

		const result = await response.json();

		if (response.ok && result.secret) {
			alert(
				`2FA enabled, please save this secret in your auth app (${result.secret}), protect it by your life `
			);
		} else {
			alert(`Failed to enable 2fa`);
		}
	} catch (error) {
		console.log("Failed to enable 2fa:", error);
		alert(`Failed to enable 2fa: ${error}`);
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
			alert(`2FA disabled`);
		} else {
			alert(`Failed to disable 2fa`);
		}
	} catch (error) {
		console.log("Failed to disable 2fa:", error);
		alert(`Failed to disable 2fa: ${error}`);
	}
}
