greetUser();
loginLanguage();

async function greetUser() {
	const greetElement = document.getElementById("greet");
	if (!greetElement) return;
	try {
		const response = await fetch(`${window.location.origin}/api/username/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (response.ok) {
			const responseData = await response.json();
			let username = responseData.username;
			let index = username.indexOf("@student.42abudhabi.ae");
			if (index != -1)
				username = username.substring(0, index);
			greetElement.textContent = `${username}`;
		} else if (response.status === 401) {
			const errorData = await response.json();
			timedAlert(`${await getTranslation("error")}`);
		} else timedAlert(`${await getTranslation("error")}: ${response.status}`);
	} catch (error) {
		timedAlert(`${await getTranslation("error")}`);
	}
}

async function loginLanguage() {
	try{
		const response = await fetch(`${window.location.origin}/api/getLanguagePreference/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});
		if (response.ok) {
			const responseData = await response.json();
			const lang = responseData.language;
			if (lang != localStorage.getItem("language"))
			{
				await setLanguagePreference(lang);
				const langData = await getLanguageData(lang);
				document.documentElement.setAttribute("lang", lang);
				updateContent(langData);
			}
		}
	}
	catch (e){
		let lang = localStorage.getItem("language") || "en";
		const langData = await getLanguageData(lang);
		document.documentElement.setAttribute("lang", lang);
		updateContent(langData);
	}
}
