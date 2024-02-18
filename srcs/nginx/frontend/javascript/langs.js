
function isAllowedLang(lang) {
	const allowedlangs = ["en", "es", "pt", "ar"];
	return allowedlangs.includes(lang);
}

// Function to update content based on selected language
function updateContent(langData) {
	document.querySelectorAll("[data-i18n]").forEach((element) => {
		const key = element.getAttribute("data-i18n");
		// element.textContent = langData[key];
		element.innerText = langData[key];
		if (element.getAttribute("placeholder"))
			element.setAttribute("placeholder", langData[key]);
	});
}

// Function to set the language preference
function setLanguagePreference(lang) {
	// get jwt token from cookie
	const jwt = document.cookie.includes("Authorization");
	if (jwt) {
		// send jwt token to server to update language preference
		fetch(`${window.location.origin}/api/setLanguagePreference/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Add this line
			body: JSON.stringify({ language: lang }),
		});
	}
	localStorage.setItem("language", lang);
}

// Function to fetch language data
async function fetchLanguageData(lang) {
	const response = await fetch(`/languages/${lang}.json`);
	return response.json();
}

// Function to change language
async function changeLanguage(lang) {
	if (!isAllowedLang(lang)) return;
	await setLanguagePreference(lang);

	const langData = await fetchLanguageData(lang);
	document.documentElement.setAttribute("lang", lang);
	updateContent(langData);
}

//Function to get translation
async function getTranslation(key) {
	let lang = localStorage.getItem("language") || "en";
	if (!isAllowedLang(lang)) lang = "en";
	const langData = await fetchLanguageData(lang);
	return langData[key];
}
