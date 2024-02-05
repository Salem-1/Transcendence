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
			greetElement.textContent = `${username}`;
		} else if (response.status === 401) {
			const errorData = await response.json();
			alert(`${await getTranslation("error")}: ${errorData.error}`);
		} else alert(`${await getTranslation("error")}: ${response.status}`);
	} catch (error) {
		alert(`${await getTranslation("error username")}: ${error}`);
	}
}

