greetUser();

async function greetUser() {
	const greetElement = document.getElementById("greet");
	if (!greetElement) return;
	try {
		const response = await fetch("http://localhost:8000/username/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (response.ok) {
			const responseData = await response.json();
			const username = responseData.username;
			greetElement.textContent = `Hello ${username}`;
		} else if (response.status === 401) {
			const errorData = await response.json();
			timedAlert(`${await getTranslation("error")}: ${errorData.error}`);
		} else timedAlert(`${await getTranslation("error")}: ${response.status}`);
	} catch (error) {
		timedAlert(`${await getTranslation("error username")}: ${error}`);
	}
}

